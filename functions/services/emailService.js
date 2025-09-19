const formData = require('form-data');
const Mailgun = require('mailgun.js');
const { formatCurrency, formatDate } = require('../utils/formatters');
const { logger } = require('firebase-functions/v2');

class EmailService {
  constructor() {
    // Lazy initialization - will be initialized on first use
    this.mg = null;
    this.domain = null;
    this.initialized = false;
  }

  /**
   * Initialize Mailgun client (lazy initialization)
   */
  initializeMailgun() {
    if (this.initialized) return;
    
    // Initialize Mailgun client
    const mailgun = new Mailgun(formData);
    const domain = process.env.MAILGUN_DOMAIN || 'mg.flowdesk.tech';
    const apiKey = process.env.MAILGUN_API_KEY;
    
    if (apiKey) {
      this.mg = mailgun.client({
        username: 'api',
        key: apiKey,
        url: process.env.MAILGUN_EU ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net'
      });
      this.domain = domain;
      // Mailgun initialized successfully
    } else {
      // Mailgun API key not found - email functionality will be disabled
      this.mg = null;
    }
    
    this.initialized = true;
  }

  /**
   * Send invoice email with PDF attachment
   * @param {Object} data - Email data including invoice, customer, and sender info
   * @returns {Promise} Mailgun response
   */
  async sendInvoiceEmail(data) {
    // Initialize Mailgun on first use
    this.initializeMailgun();
    
    const { invoice, customer, sender, customMessage, pdfBase64, recipients } = data;

    // Validate Mailgun configuration
    if (!this.mg) {
      throw new Error('Mailgun API key not configured. Please check your .env file.');
    }

    // Generate email content
    const emailContent = this.generateInvoiceEmailContent({
      invoice,
      customer,
      sender,
      customMessage
    });

    // Handle recipients - use provided recipients or fall back to customer email
    const emailRecipients = recipients && recipients.length > 0 
      ? recipients 
      : [customer.email];

    // Prepare email data for Mailgun
    const messageData = {
      from: `${sender.company || 'FlowDesk Invoice'} <${process.env.MAILGUN_FROM_EMAIL || 'noreply@flowdesk.tech'}>`,
      to: emailRecipients,
      subject: `Invoice ${invoice.formattedInvoiceNumber} from ${sender.displayName || sender.company}`,
      html: emailContent,
      'h:Reply-To': sender.email,
      attachment: {
        data: Buffer.from(pdfBase64, 'base64'),
        filename: `invoice_${invoice.formattedInvoiceNumber}.pdf`,
        contentType: 'application/pdf'
      }
    };

    try {
      const response = await this.mg.messages.create(this.domain, messageData);
      logger.info('Invoice email sent successfully', {
        recipients: emailRecipients.length,
        messageId: response.id,
        domain: this.domain
      });
      return {
        success: true,
        messageId: response.id,
        status: response.status,
        recipientCount: emailRecipients.length
      };
    } catch (error) {
      logger.error('Error sending invoice email', {
        error: error.message,
        details: error.details,
        stack: error.stack,
        recipients: emailRecipients.length
      });
      throw new Error(error.message || 'Failed to send invoice email');
    }
  }

  /**
   * Send contact form email
   * @param {Object} data - Contact form data
   * @returns {Promise} Mailgun response
   */
  async sendContactEmail(data) {
    // Initialize Mailgun on first use
    this.initializeMailgun();
    
    const { name, email, subject, message } = data;

    // Validate Mailgun configuration
    if (!this.mg) {
      throw new Error('Mailgun API key not configured. Please check your .env file.');
    }

    // Generate email content
    const emailContent = this.generateContactEmailContent({
      name,
      email,
      subject,
      message
    });

    // Prepare email data for Mailgun
    const messageData = {
      from: `${name} <${process.env.MAILGUN_FROM_EMAIL || 'noreply@flowdesk.tech'}>`,
      to: 'contact@flowdesk.tech',
      subject: `[Contact Form] ${subject}`,
      html: emailContent,
      'h:Reply-To': email,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    try {
      const response = await this.mg.messages.create(this.domain, messageData);
      logger.info('Contact email sent successfully', {
        messageId: response.id,
        domain: this.domain
      });
      return {
        success: true,
        messageId: response.id,
        status: response.status
      };
    } catch (error) {
      logger.error('Error sending contact email', {
        error: error.message,
        details: error.details,
        stack: error.stack
      });
      throw new Error(error.message || 'Failed to send contact email');
    }
  }

  /**
   * Generate HTML content for invoice email
   */
  generateInvoiceEmailContent({ invoice, customer, sender, customMessage }) {
    const currency = invoice.currency || 'USD';
    const formattedTotal = formatCurrency(invoice.total, currency);
    const formattedDueDate = formatDate(new Date(invoice.dueDate));

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.formattedInvoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #1976d2;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: normal;
    }
    .content {
      padding: 40px 30px;
    }
    .invoice-details {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .invoice-details table {
      width: 100%;
      border-collapse: collapse;
    }
    .invoice-details td {
      padding: 8px 0;
    }
    .invoice-details .label {
      font-weight: 600;
      color: #666;
      width: 40%;
    }
    .amount {
      font-size: 24px;
      color: #1976d2;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .custom-message {
      background-color: #e3f2fd;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #1976d2;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invoice from ${sender.company}</h1>
    </div>
    
    <div class="content">
      <p>Dear ${customer.name},</p>
      
      <p>Please find attached invoice <strong>${invoice.formattedInvoiceNumber}</strong> for your review.</p>
      
      ${customMessage ? `
      <div class="custom-message">
        <p>${customMessage}</p>
      </div>
      ` : ''}
      
      <div class="invoice-details">
        <table>
          <tr>
            <td class="label">Invoice Number:</td>
            <td><strong>${invoice.formattedInvoiceNumber}</strong></td>
          </tr>
          <tr>
            <td class="label">Invoice Date:</td>
            <td>${formatDate(new Date(invoice.date))}</td>
          </tr>
          <tr>
            <td class="label">Due Date:</td>
            <td><strong>${formattedDueDate}</strong></td>
          </tr>
          <tr>
            <td class="label">Payment Terms:</td>
            <td>${invoice.paymentTerms || 'Due on receipt'}</td>
          </tr>
        </table>
      </div>
      
      <div class="amount">
        Total Due: ${formattedTotal}
      </div>
      
      <p>The invoice PDF is attached to this email for your records.</p>
      
      <p>If you have any questions regarding this invoice, please don't hesitate to contact us.</p>
      
      <p>Thank you for your business!</p>
      
      <p>Best regards,<br>
      ${sender.displayName || sender.company}<br>
      ${sender.email}<br>
      ${sender.phone ? `${sender.phone}` : ''}
      </p>
    </div>
    
    <div class="footer">
      <p>This invoice was sent via FlowDesk Invoice Management System</p>
      <p>&copy; ${new Date().getFullYear()} FlowDesk. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate HTML content for contact form email
   */
  generateContactEmailContent({ name, email, subject, message }) {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #1e293b;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f8f9fa;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #e9ecef;
    }
    .field {
      margin-bottom: 20px;
      padding: 15px;
      background-color: white;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
    }
    .label {
      font-weight: bold;
      color: #64748b;
      margin-bottom: 5px;
    }
    .value {
      color: #1e293b;
    }
    .message-box {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Contact Form Submission</h2>
    <p>FlowDesk Invoice Management</p>
  </div>
  
  <div class="content">
    <p>You have received a new contact form submission from your FlowDesk website.</p>
    
    <div class="field">
      <div class="label">Name:</div>
      <div class="value">${name}</div>
    </div>
    
    <div class="field">
      <div class="label">Email:</div>
      <div class="value"><a href="mailto:${email}">${email}</a></div>
    </div>
    
    <div class="field">
      <div class="label">Subject:</div>
      <div class="value">${subject}</div>
    </div>
    
    <div class="field">
      <div class="label">Date Submitted:</div>
      <div class="value">${currentDate}</div>
    </div>
    
    <div class="message-box">
      <div class="label">Message:</div>
      <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
    </div>
    
    <div class="footer">
      <p>This email was sent from the contact form at flowdesk.tech</p>
      <p>You can reply directly to this email to respond to ${name}</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

module.exports = new EmailService();
