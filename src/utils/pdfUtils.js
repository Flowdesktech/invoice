import toast from 'react-hot-toast';

/**
 * Converts base64 PDF data to a Blob
 * @param {string} base64Data - The base64 encoded PDF data
 * @returns {Blob|null} - The PDF blob or null if conversion fails
 */
const base64ToBlob = (base64Data) => {
  try {
    if (!base64Data) {
      return null;
    }

    // Remove data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, '');
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    return null;
  }
};

/**
 * Opens a PDF from base64 data in a new browser tab
 * @param {string} base64Data - The base64 encoded PDF data
 * @param {Object} options - Optional configuration
 * @param {string} options.filename - Suggested filename for download
 * @param {boolean} options.showSuccessToast - Whether to show success toast (default: true)
 * @returns {boolean} - True if successful, false otherwise
 */
export const openPdfInNewTab = (base64Data, options = {}) => {
  const { filename = 'document.pdf', showSuccessToast = true } = options;
  
  try {
    const blob = base64ToBlob(base64Data);
    
    if (!blob) {
      toast.error('No PDF data received');
      return false;
    }
    
    const url = window.URL.createObjectURL(blob);
    
    // Open in new tab
    window.open(url, '_blank');
    
    // Clean up blob URL after a short delay
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
    
    if (showSuccessToast) {
      toast.success('PDF generated successfully!');
    }
    
    return true;
  } catch (error) {
    console.error('Error opening PDF:', error);
    toast.error('Failed to open PDF');
    return false;
  }
};

/**
 * Downloads a PDF from base64 data
 * @param {string} base64Data - The base64 encoded PDF data
 * @param {string} filename - The filename for the download
 * @returns {boolean} - True if successful, false otherwise
 */
export const downloadPdf = (base64Data, filename = 'document.pdf') => {
  try {
    const blob = base64ToBlob(base64Data);
    
    if (!blob) {
      toast.error('No PDF data received');
      return false;
    }
    
    const url = window.URL.createObjectURL(blob);
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
    
    toast.success('PDF downloaded successfully!');
    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error('Failed to download PDF');
    return false;
  }
};
