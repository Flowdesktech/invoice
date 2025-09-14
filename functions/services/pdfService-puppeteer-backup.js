const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { storage } = require('../config/firebase');
const { formatCurrency, formatDate } = require('../utils/formatters');

class PdfService {
  constructor() {
    this.bucket = storage.bucket();
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
    handlebars.registerHelper('formatDate', (date) => {
      return formatDate(date);
    });

    // Conditional helper for status classes
    handlebars.registerHelper('eq', (a, b) => a === b);
  }

  /**
   * Generate PDF from invoice data
   */
  async generateInvoicePDF(data) {
    const { invoice, userData, customer } = data;
    let browser = null;
    let page = null;

    try {
      console.log('Starting PDF generation for invoice:', invoice.invoiceNumber);
      
      // Read and compile template
      const templateHtml = await fs.readFile(this.templatePath, 'utf-8');
      const template = handlebars.compile(templateHtml);

      // Prepare template data
      const templateData = {
        invoice,
        userData,
        customer,
        currentDate: new Date().toISOString()
      };

      // Generate HTML
      const html = template(templateData);

      console.log('Launching Puppeteer browser...');
      
      // Launch Puppeteer with optimized settings for serverless
      browser = await puppeteer.launch({
        headless: 'new', // Use new headless mode
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-trials',
          '--disable-features=BlockInsecurePrivateNetworkRequests'
        ],
        timeout: 30000, // 30 second timeout
        // Use a custom executable path if provided (for serverless environments)
        ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
        })
      });

      console.log('Creating new page...');
      page = await browser.newPage();
      
      // Set a longer timeout for page operations
      page.setDefaultTimeout(30000);
      
      console.log('Setting page content...');
      // Set content and wait for fonts to load
      await page.setContent(html, { 
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 20000 
      });

      console.log('Generating PDF...');
      // Generate PDF with timeout
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        timeout: 30000
      });

      console.log('PDF generated successfully, size:', pdfBuffer.length);

      // Upload to Firebase Storage
      const fileName = `invoices/${invoice.userId}/${invoice.id}/invoice-${invoice.invoiceNumber}.pdf`;
      const file = this.bucket.file(fileName);

      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            invoiceId: invoice.id,
            userId: invoice.userId,
            invoiceNumber: invoice.invoiceNumber
          }
        }
      });

      // Generate signed URL (valid for 1 year)
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year
      });

      return url;
    } catch (error) {
      console.error('PDF generation error:', error);
      console.error('Error stack:', error.stack);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
      // Always cleanup browser resources
      try {
        if (page) {
          await page.close();
        }
        if (browser) {
          await browser.close();
          console.log('Browser closed successfully');
        }
      } catch (cleanupError) {
        console.error('Error during browser cleanup:', cleanupError);
      }
    }
  }

  /**
   * Generate PDF preview (returns base64 string for immediate display)
   */
  async generatePdfPreview(data) {
    const { invoice, userData, customer } = data;
    let browser = null;
    let page = null;

    try {
      console.log('Starting PDF preview generation for invoice:', invoice.invoiceNumber);
      
      // Read and compile template
      const templateHtml = await fs.readFile(this.templatePath, 'utf-8');
      const template = handlebars.compile(templateHtml);

      // Prepare template data
      const templateData = {
        invoice,
        userData,
        customer,
        currentDate: new Date().toISOString()
      };

      // Generate HTML
      const html = template(templateData);

      console.log('Launching Puppeteer browser for preview...');
      
      // Launch Puppeteer with optimized settings for serverless
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        timeout: 30000,
        ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
        })
      });

      console.log('Creating new page for preview...');
      page = await browser.newPage();
      page.setDefaultTimeout(30000);
      
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 20000
      });

      console.log('Generating PDF preview...');
      // Generate PDF as base64
      const pdfBase64 = await page.pdf({
        format: 'A4',
        printBackground: true,
        encoding: 'base64',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        timeout: 30000
      });

      console.log('PDF preview generated successfully');

      return `data:application/pdf;base64,${pdfBase64}`;
    } catch (error) {
      console.error('PDF preview generation error:', error);
      console.error('Error stack:', error.stack);
      throw new Error(`Failed to generate PDF preview: ${error.message}`);
    } finally {
      // Always cleanup browser resources
      try {
        if (page) {
          await page.close();
        }
        if (browser) {
          await browser.close();
          console.log('Browser closed successfully');
        }
      } catch (cleanupError) {
        console.error('Error during browser cleanup:', cleanupError);
      }
    }
  }

  /**
   * Delete PDF from storage
   */
  async deletePdf(userId, invoiceId, invoiceNumber) {
    try {
      const fileName = `invoices/${userId}/${invoiceId}/invoice-${invoiceNumber}.pdf`;
      await this.bucket.file(fileName).delete();
      return true;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      return false;
    }
  }
}

module.exports = new PdfService();
