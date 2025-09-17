const handlebars = require('handlebars');

class TemplateBuilder {
  /**
   * Build complete invoice HTML based on template configuration
   */
  static buildInvoiceHTML(data, template) {
    const { invoice, userData, customer, profileData } = data;
    const layout = template.layout;
    const colors = template.colors;
    const fonts = template.fonts;
    const spacing = template.spacing;

    // Get the appropriate header based on layout type
    const header = this.buildHeader(invoice, userData, customer, profileData, template);
    
    // Get the appropriate items section based on layout type
    const itemsSection = this.buildItemsSection(invoice, template);
    
    // Get the appropriate footer based on layout type
    const footer = this.buildFooter(invoice, userData, profileData, template);

    // Build the complete HTML
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${this.buildCSS(template)}
  </style>
</head>
<body>
  <div class="invoice-container">
    ${header}
    ${itemsSection}
    ${footer}
  </div>
</body>
</html>
    `;
  }

  /**
   * Build CSS based on template configuration
   */
  static buildCSS(template) {
    const { colors, fonts, spacing, layout } = template;
    
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${fonts.primary};
        font-size: ${fonts.size.base}pt;
        color: ${colors.text};
        background: ${colors.background};
        padding: ${spacing.page.top}px ${spacing.page.right}px ${spacing.page.bottom}px ${spacing.page.left}px;
      }
      
      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        background: ${colors.background};
      }
      
      /* Header Styles */
      .header {
        margin-bottom: ${spacing.section}px;
        ${layout.showHeaderBackground ? `background: ${colors.headerBg};` : ''}
        ${layout.showHeaderBackground ? `color: ${colors.headerText};` : ''}
        ${layout.showHeaderBackground ? `padding: 20px;` : ''}
        ${layout.headerPosition === 'diagonal' ? 'transform: skew(-2deg); margin-bottom: 40px;' : ''}
      }
      
      .header-${layout.headerPosition} {
        ${this.getHeaderLayoutStyles(layout.headerPosition)}
      }
      
      h1 {
        font-family: ${fonts.primary};
        font-size: ${fonts.size.header}pt;
        color: ${layout.showHeaderBackground ? colors.headerText : colors.primary};
        margin-bottom: ${spacing.line}px;
      }
      
      h2 {
        font-family: ${fonts.secondary};
        font-size: ${fonts.size.subheader}pt;
        color: ${colors.text};
        margin-bottom: ${spacing.line}px;
      }
      
      /* Table Styles */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: ${spacing.section}px 0;
      }
      
      th {
        background: ${colors.tableHeaderBg};
        color: ${colors.text};
        font-weight: bold;
        padding: 12px;
        text-align: left;
        ${layout.showItemBorder ? `border: 1px solid ${colors.border};` : ''}
        ${layout.itemsLayout === 'table-rounded' ? 'border-radius: 8px 8px 0 0;' : ''}
      }
      
      td {
        padding: 10px 12px;
        ${layout.showItemBorder ? `border: 1px solid ${colors.border};` : ''}
      }
      
      tr:nth-child(even) {
        background: ${colors.tableRowAltBg};
      }
      
      /* Layout-specific styles */
      ${this.getLayoutSpecificStyles(layout, colors)}
      
      /* Utility classes */
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .mt-1 { margin-top: ${spacing.line}px; }
      .mt-2 { margin-top: ${spacing.line * 2}px; }
      .mb-1 { margin-bottom: ${spacing.line}px; }
      .mb-2 { margin-bottom: ${spacing.line * 2}px; }
      .text-muted { color: ${colors.muted}; }
      .text-primary { color: ${colors.primary}; }
      .text-secondary { color: ${colors.secondary}; }
      
      .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: ${fonts.size.small}pt;
        font-weight: bold;
      }
      
      .badge-paid { background: #10b981; color: white; }
      .badge-pending { background: ${colors.secondary}; color: white; }
      .badge-overdue { background: #ef4444; color: white; }
      .badge-draft { background: ${colors.muted}; color: white; }
    `;
  }

  /**
   * Get header layout styles based on position
   */
  static getHeaderLayoutStyles(position) {
    switch (position) {
      case 'top':
        return 'display: flex; justify-content: space-between; align-items: flex-start;';
      case 'centered':
        return 'text-align: center;';
      case 'sidebar':
        return 'display: grid; grid-template-columns: 200px 1fr; gap: 20px;';
      case 'inline':
        return 'display: flex; align-items: center; gap: 20px;';
      case 'split':
        return 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px;';
      case 'floating':
        return 'position: relative; padding: 30px; border: 2px solid; border-radius: 8px;';
      default:
        return '';
    }
  }

  /**
   * Get layout-specific additional styles
   */
  static getLayoutSpecificStyles(layout, colors) {
    switch (layout.type) {
      case 'modern':
        return `
          .invoice-number-box {
            background: ${colors.primary};
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            display: inline-block;
          }
        `;
      case 'minimal':
        return `
          .divider {
            height: 1px;
            background: ${colors.border};
            margin: 20px 0;
          }
        `;
      case 'corporate':
        return `
          .sidebar {
            background: ${colors.primary};
            color: white;
            padding: 20px;
            height: 100%;
          }
        `;
      case 'creative':
        return `
          .creative-shape {
            width: 100px;
            height: 100px;
            background: ${colors.accent};
            transform: rotate(45deg);
            position: absolute;
            top: -50px;
            right: -50px;
          }
        `;
      case 'elegant':
        return `
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.05;
            font-size: 120pt;
            color: ${colors.primary};
            z-index: -1;
          }
        `;
      default:
        return '';
    }
  }

  /**
   * Build header section based on layout type
   */
  static buildHeader(invoice, userData, customer, profileData, template) {
    const { layout, colors } = template;
    const companyInfo = profileData || userData;
    
    switch (layout.headerPosition) {
      case 'centered':
        return this.buildCenteredHeader(invoice, companyInfo, customer, template);
      case 'sidebar':
        return this.buildSidebarHeader(invoice, companyInfo, customer, template);
      case 'split':
        return this.buildSplitHeader(invoice, companyInfo, customer, template);
      case 'diagonal':
        return this.buildDiagonalHeader(invoice, companyInfo, customer, template);
      case 'inline':
        return this.buildInlineHeader(invoice, companyInfo, customer, template);
      case 'minimal':
      default:
        return this.buildStandardHeader(invoice, companyInfo, customer, template);
    }
  }

  /**
   * Standard header layout
   */
  static buildStandardHeader(invoice, companyInfo, customer, template) {
    return `
      <div class="header header-${template.layout.headerPosition}">
        <div class="company-info">
          <h1>${companyInfo.displayName || companyInfo.company}</h1>
          ${companyInfo.company ? `<div>${companyInfo.company}</div>` : ''}
          ${companyInfo.email ? `<div>${companyInfo.email}</div>` : ''}
          ${companyInfo.phone ? `<div>${companyInfo.phone}</div>` : ''}
          ${companyInfo.address ? `
            <div class="mt-1">
              ${companyInfo.address.street || ''}<br>
              ${companyInfo.address.city || ''} ${companyInfo.address.state || ''} ${companyInfo.address.zipCode || ''}<br>
              ${companyInfo.address.country || ''}
            </div>
          ` : ''}
        </div>
        <div class="invoice-info text-right">
          <div class="${template.layout.invoiceNumberPosition === 'badge' ? 'invoice-number-box' : ''}">
            <h2>INVOICE #${invoice.invoiceNumber}</h2>
          </div>
          <div class="mt-1">
            <div><strong>Date:</strong> {{formatDate invoice.date timezone="${companyInfo.timezone}"}}</div>
            <div><strong>Due Date:</strong> {{formatDate invoice.dueDate timezone="${companyInfo.timezone}"}}</div>
            <div class="mt-1">
              <span class="badge badge-${invoice.status}">${invoice.status.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="customer-section mb-2">
        <h2>Bill To:</h2>
        <div class="customer-info">
          <strong>${customer.name}</strong><br>
          ${customer.email || ''}<br>
          ${customer.phone || ''}<br>
          ${customer.address ? `
            ${customer.address.street || ''}<br>
            ${customer.address.city || ''} ${customer.address.state || ''} ${customer.address.zipCode || ''}<br>
            ${customer.address.country || ''}
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Centered header layout
   */
  static buildCenteredHeader(invoice, companyInfo, customer, template) {
    return `
      <div class="header header-centered">
        <h1>${companyInfo.displayName || companyInfo.company}</h1>
        ${companyInfo.company ? `<div class="text-muted">${companyInfo.company}</div>` : ''}
        <div class="text-muted">
          ${companyInfo.email || ''} ${companyInfo.phone ? `• ${companyInfo.phone}` : ''}
        </div>
        
        <div class="mt-2">
          <h2>INVOICE</h2>
          <div class="invoice-number-${template.layout.invoiceNumberPosition}">
            #${invoice.invoiceNumber}
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
        <div>
          <h2>From:</h2>
          <div>${companyInfo.address?.street || ''}</div>
          <div>${companyInfo.address?.city || ''} ${companyInfo.address?.state || ''} ${companyInfo.address?.zipCode || ''}</div>
        </div>
        <div>
          <h2>To:</h2>
          <strong>${customer.name}</strong>
          <div>${customer.email || ''}</div>
          <div>${customer.phone || ''}</div>
        </div>
      </div>
    `;
  }

  /**
   * Build items section based on layout type
   */
  static buildItemsSection(invoice, template) {
    const { layout } = template;
    
    switch (layout.itemsLayout) {
      case 'cards':
        return this.buildCardsItems(invoice, template);
      case 'simple-lines':
        return this.buildSimpleLinesItems(invoice, template);
      case 'table-rounded':
        return this.buildRoundedTableItems(invoice, template);
      default:
        return this.buildStandardTableItems(invoice, template);
    }
  }

  /**
   * Standard table items layout
   */
  static buildStandardTableItems(invoice, template) {
    return `
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-center">Quantity</th>
            <th class="text-right">Rate</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {{#each invoice.lineItems}}
          <tr>
            <td>{{this.description}}</td>
            <td class="text-center">{{this.quantity}}</td>
            <td class="text-right">{{formatCurrency this.rate currency=../invoice.currency}}</td>
            <td class="text-right">{{formatCurrency this.amount currency=../invoice.currency}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>
      
      <div class="totals-section" style="margin-top: 30px;">
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>Subtotal:</span>
              <span>{{formatCurrency invoice.subtotal currency=invoice.currency}}</span>
            </div>
            {{#if invoice.taxRate}}
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>Tax ({{invoice.taxRate}}%):</span>
              <span>{{formatCurrency invoice.taxAmount currency=invoice.currency}}</span>
            </div>
            {{/if}}
            <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 14pt; font-weight: bold; border-top: 2px solid ${template.colors.primary};">
              <span>Total:</span>
              <span>{{formatCurrency invoice.total currency=invoice.currency}}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build footer section based on layout type
   */
  static buildFooter(invoice, userData, profileData, template) {
    const { layout } = template;
    
    return `
      <div class="footer mt-2">
        ${invoice.notes ? `
          <div class="notes-section">
            <h2>Notes</h2>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}
        
        ${invoice.paymentTerms ? `
          <div class="payment-terms mt-1">
            <strong>Payment Terms:</strong> ${invoice.paymentTerms}
          </div>
        ` : ''}
        
        ${layout.footerLayout === 'signature-ready' ? `
          <div style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
              <div style="border-top: 1px solid ${template.colors.border}; padding-top: 8px;">
                Authorized Signature
              </div>
            </div>
            <div>
              <div style="border-top: 1px solid ${template.colors.border}; padding-top: 8px;">
                Date
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

module.exports = TemplateBuilder;
