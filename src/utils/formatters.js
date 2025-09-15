/**
 * Utility functions for formatting data in the frontend
 */

/**
 * Format invoice number with prefix
 * @param {number|string} invoiceNumber - The invoice number (without prefix)
 * @param {string} prefix - The invoice prefix (e.g., 'INV')
 * @returns {string} Formatted invoice number (e.g., 'INV-00001')
 */
export const formatInvoiceNumber = (invoiceNumber, prefix = 'INV') => {
  if (!invoiceNumber && invoiceNumber !== 0) return '';
  
  // Convert to number if string
  const num = typeof invoiceNumber === 'string' ? parseInt(invoiceNumber, 10) : invoiceNumber;
  
  // Format with prefix and padding
  return `${prefix}-${String(num).padStart(5, '0')}`;
};

/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount || 0);
};

/**
 * Format date values
 * @param {string|Date|number} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format date for display in short format
 * @param {string|Date|number} date - The date to format
 * @returns {string} Formatted date string (MMM DD, YYYY)
 */
export const formatDateShort = (date) => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
