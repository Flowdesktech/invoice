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
    handlebars.registerHelper('formatCurrency', (amount, options) => {
      const currency = options?.hash?.currency || 'USD';
      return formatCurrency(amount, currency);
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
   * Common function to generate PDF from invoice data
   * @private
   */
  async _generatePdfFromInvoice(data, isPreview = false) {
    const { invoice, userData, customer, profileData } = data;
    
    // Get timezone from profile or user settings
    const timezone = profileData?.invoiceSettings?.timezone || userData?.invoiceSettings?.timezone || 'America/New_York';
    
    // Get invoice prefix from profile or user settings
    const invoicePrefix = profileData?.invoiceSettings?.prefix || userData?.invoiceSettings?.prefix || 'INV';

    try {
      
      // Determine which template to use
      const templateId = invoice.templateId || 'default';
      const templateFileName = `${templateId}.html`;
      const templatePath = path.join(__dirname, '..', 'templates', templateFileName);
      const commonPath = path.join(__dirname, '..', 'templates', 'common.html');
      
      // Read template HTML
      const templateHtml = await fs.readFile(templatePath, 'utf-8');
      
      // Try to read common.html, but don't fail if it's missing
      let commonHtml = '';
      try {
        commonHtml = await fs.readFile(commonPath, 'utf-8');
      } catch (error) {
        console.warn('Warning: common.html not found or could not be read. Using template without common styles.');
      }
      
      // Extract common styles and running header from common.html if available
      const styleMatch = commonHtml ? commonHtml.match(/<style[^>]*id="common-styles"[^>]*>([\s\S]*?)<\/style>/) : null;
      const commonStyles = styleMatch ? styleMatch[0] : '';
      const runningHeader = commonHtml ? (commonHtml.match(/<!-- RUNNING_HEADER_START -->([\s\S]*?)<!-- RUNNING_HEADER_END -->/)?.[1] || '') : '';
      
      // First compile the template WITHOUT common styles to avoid Handlebars parsing CSS
      let template;
      try {
        template = handlebars.compile(templateHtml);
      } catch (compileError) {
        throw new Error(`Handlebars compilation failed: ${compileError.message}`);
      }

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
        currentDate: new Date().valueOf()
      };

      // Generate HTML
      let html = template(templateData);
      
      // NOW inject common styles AFTER template compilation to avoid Handlebars parsing CSS
      if (commonStyles) {
        html = html.replace('</head>', `${commonStyles}\n</head>`);
      }
      
      // Also inject running header if available
      if (runningHeader && html.includes('<body>')) {
        // Need to compile the running header as it contains Handlebars expressions
        const headerTemplate = handlebars.compile(runningHeader);
        const compiledHeader = headerTemplate(templateData);
        html = html.replace('<body>', `<body>\n${compiledHeader}\n`);
      }
      
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

      // Convert to base64
      const pdfBase64 = pdfBuffer.toString('base64');
      
      return `data:application/pdf;base64,${pdfBase64}`;
    } catch (error) {
      const errorType = isPreview ? 'preview generation' : 'generation';
      console.error(`PDF ${errorType} error:`, error);
      console.error('Error stack:', error.stack);
      throw new Error(`Failed to generate PDF${isPreview ? ' preview' : ''}: ${error.message}`);
    }
  }

  /**
   * Generate PDF from invoice data
   */
  async generateInvoicePDF(data) {
    return await this._generatePdfFromInvoice(data, false);
  }

  /**
   * Generate PDF preview (returns base64 string for immediate display)
   */
  async generatePdfPreview(data) {
    return await this._generatePdfFromInvoice(data, true);
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
