const pdf = require('html-pdf-node');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { formatCurrency, formatDate, formatDateShort, formatInvoiceNumber } = require('../utils/formatters');

class PdfService {
  constructor() {
    this.templatePath = path.join(__dirname, '..', 'templates', 'invoice.html');
    this.registerHelpers();
  }

  /**
   * Register Handlebars helpers for template rendering
   */
  registerHelpers() {
    // Format currency helper
    handlebars.registerHelper('formatCurrency', (amount) => {
      return formatCurrency(amount);
    });

    // Format date helper
    handlebars.registerHelper('formatDate', (date, options) => {
      // Get timezone from options.hash or use default
      const timezone = options?.hash?.timezone || 'America/New_York';
      return formatDate(date, timezone);
    });

    // Format date short helper
    handlebars.registerHelper('formatDateShort', (date, options) => {
      // Get timezone from options.hash or use default
      const timezone = options?.hash?.timezone || 'America/New_York';
      return formatDateShort(date, timezone);
    });

    // Conditional helper for status classes
    handlebars.registerHelper('eq', (a, b) => a === b);

    // Format invoice number helper
    handlebars.registerHelper('formatInvoiceNumber', (number, prefix) => {
      return formatInvoiceNumber(number, prefix || 'INV');
    });
  }

  /**
   * Generate PDF from invoice data
   */
  async generateInvoicePDF(data) {
    const { invoice, userData, customer, profileData } = data;
    
    // Get timezone from profile or user settings
    const timezone = profileData?.invoiceSettings?.timezone || userData?.invoiceSettings?.timezone || 'America/New_York';
    
    // Get invoice prefix from profile or user settings
    const invoicePrefix = profileData?.invoiceSettings?.prefix || userData?.invoiceSettings?.prefix || 'INV';

    try {
      console.log('Starting PDF generation for invoice:', invoice.invoiceNumber);
      
      // Read and compile template
      const templateHtml = await fs.readFile(this.templatePath, 'utf-8');
      const template = handlebars.compile(templateHtml);

      // Prepare template data
      const templateData = {
        invoice: {
          ...invoice,
          formattedInvoiceNumber: formatInvoiceNumber(invoice.invoiceNumber, invoicePrefix)
        },
        userData,
        customer,
        profileData,
        timezone,
        invoicePrefix,
        currentDate: new Date().toISOString()
      };

      // Generate HTML
      const html = template(templateData);

      console.log('Generating PDF with html-pdf-node...');
      
      // PDF options
      const options = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      };

      // Generate PDF buffer
      const pdfBuffer = await pdf.generatePdf({ content: html }, options);

      console.log('PDF generated successfully, size:', pdfBuffer.length);

      // Convert PDF buffer to base64
      const base64Pdf = pdfBuffer.toString('base64');
      
      // Return base64 encoded PDF data
      return `data:application/pdf;base64,${base64Pdf}`;
    } catch (error) {
      console.error('PDF generation error:', error);
      console.error('Error stack:', error.stack);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Generate PDF preview (returns base64 string for immediate display)
   */
  async generatePdfPreview(data) {
    const { invoice, userData, customer, profileData } = data;
    
    // Get timezone from profile or user settings
    const timezone = profileData?.invoiceSettings?.timezone || userData?.invoiceSettings?.timezone || 'America/New_York';
    
    // Get invoice prefix from profile or user settings
    const invoicePrefix = profileData?.invoiceSettings?.prefix || userData?.invoiceSettings?.prefix || 'INV';

    try {
      console.log('Starting PDF preview generation for invoice:', invoice.invoiceNumber);
      
      // Read and compile template
      const templateHtml = await fs.readFile(this.templatePath, 'utf-8');
      const template = handlebars.compile(templateHtml);

      // Prepare template data
      const templateData = {
        invoice: {
          ...invoice,
          formattedInvoiceNumber: formatInvoiceNumber(invoice.invoiceNumber, invoicePrefix)
        },
        userData,
        customer,
        profileData,
        timezone,
        invoicePrefix,
        currentDate: new Date().toISOString()
      };

      // Generate HTML
      const html = template(templateData);

      console.log('Generating PDF preview with html-pdf-node...');
      
      // PDF options
      const options = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      };

      // Generate PDF buffer
      const pdfBuffer = await pdf.generatePdf({ content: html }, options);
      
      console.log('PDF preview generated successfully');

      // Convert to base64
      const pdfBase64 = pdfBuffer.toString('base64');
      
      return `data:application/pdf;base64,${pdfBase64}`;
    } catch (error) {
      console.error('PDF preview generation error:', error);
      console.error('Error stack:', error.stack);
      throw new Error(`Failed to generate PDF preview: ${error.message}`);
    }
  }

  /**
   * Delete PDF from storage
   */
  async deletePdf(userId, invoiceId, invoiceNumber) {
    try {
      const fileName = `invoices/${userId}/${invoiceId}/invoice-${invoiceNumber}.pdf`;
      await this.bucket.file(fileName).delete();
      console.log('PDF deleted successfully:', fileName);
    } catch (error) {
      console.error('Error deleting PDF:', error);
      // Don't throw error if file doesn't exist
      if (error.code !== 404) {
        throw error;
      }
    }
  }
}

module.exports = new PdfService();
