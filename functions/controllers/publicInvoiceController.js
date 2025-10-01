const pdfService = require('../services/pdfService');
const { logger } = require('firebase-functions/v2');

/**
 * Public Invoice Controller
 * Handles invoice preview and PDF generation without authentication
 */

// Preview invoice without saving (public access)
exports.preview = async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Validate required fields
    if (!invoiceData.customerName) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    // Format invoice data for template
    const formattedInvoice = {
      invoiceNumber: invoiceData.invoiceNumber || `PREVIEW-${Date.now()}`,
      // Convert date format to just the date portion
      date: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'preview',
      
      // Sender information (public users)
      senderName: invoiceData.senderName || 'Your Business Name',
      senderEmail: invoiceData.senderEmail || '',
      senderPhone: invoiceData.senderPhone || '',
      senderAddress: invoiceData.senderAddress || '',
      senderDisplayName: invoiceData.senderName || 'Your Business Name',
      senderDisplayNameInitial: (invoiceData.senderName || 'Y').charAt(0).toUpperCase(),
      
      // Customer information
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail || '',
      customerAddress: invoiceData.customerAddress || '',
      
      // Invoice details - changed from items to lineItems
      lineItems: invoiceData.lineItems || [],
      subtotal: invoiceData.subtotal || 0,
      taxRate: invoiceData.taxRate || 0,
      taxAmount: invoiceData.taxAmount || 0,
      discount: invoiceData.discount || 0,
      total: invoiceData.total || invoiceData.subtotal || 0,
      notes: invoiceData.notes || '',
      paymentTerms: invoiceData.paymentTerms || 'Due on receipt',
      currency: invoiceData.currency || 'USD',
      
      // Template
      templateId: invoiceData.templateId || 'modern'
    };

    // Create data structure matching what pdfService expects
    const previewData = {
      invoice: formattedInvoice,
      userData: {
        // Sender fields at root level for pdfService
        displayName: invoiceData.senderName || 'Your Business Name',
        company: invoiceData.senderName || 'Your Business Name',
        email: invoiceData.senderEmail || '',
        phone: invoiceData.senderPhone || '',
        address: {
          street: invoiceData.senderAddress || '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        invoiceSettings: {
          company: invoiceData.senderName || 'Your Business Name',
          invoicePrefix: 'INV',
          displayNameType: 'business', // Default to business name
          currency: invoiceData.currency || 'USD'
        }
      },
      customer: {
        name: invoiceData.customerName,
        email: invoiceData.customerEmail || '',
        address: {
          street: invoiceData.customerAddress || '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      }
    };

    // Generate PDF preview (returns base64)
    const pdfBase64 = await pdfService.generatePdfPreview(previewData);
    
    // For preview, we'll return the PDF as base64 which can be displayed in an iframe
    res.json({ 
      pdfBase64: pdfBase64.replace(/^data:application\/pdf;base64,/, ''),
      mimeType: 'application/pdf'
    });
  } catch (error) {
    logger.error('Error generating invoice preview:', error);
    res.status(500).json({ error: 'Failed to generate invoice preview' });
  }
};

// Generate PDF without saving (public access)
exports.generatePdf = async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Validate required fields
    if (!invoiceData.customerName) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    // Format invoice data for template
    const formattedInvoice = {
      invoiceNumber: invoiceData.invoiceNumber || `INV-${Date.now()}`,
      // Convert date format to just the date portion
      date: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      
      // Sender information (public users)
      senderName: invoiceData.senderName || 'Your Business Name',
      senderEmail: invoiceData.senderEmail || '',
      senderPhone: invoiceData.senderPhone || '',
      senderAddress: invoiceData.senderAddress || '',
      senderDisplayName: invoiceData.senderName || 'Your Business Name',
      senderDisplayNameInitial: (invoiceData.senderName || 'Y').charAt(0).toUpperCase(),
      
      // Customer information
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail || '',
      customerAddress: invoiceData.customerAddress || '',
      
      // Invoice details - changed from items to lineItems
      lineItems: invoiceData.lineItems || [],
      subtotal: invoiceData.subtotal || 0,
      taxRate: invoiceData.taxRate || 0,
      taxAmount: invoiceData.taxAmount || 0,
      discount: invoiceData.discount || 0,
      total: invoiceData.total || invoiceData.subtotal || 0,
      notes: invoiceData.notes || '',
      paymentTerms: invoiceData.paymentTerms || 'Due on receipt',
      currency: invoiceData.currency || 'USD',
      
      // Template
      templateId: invoiceData.templateId || 'modern'
    };

    // Create data structure matching what pdfService expects
    const previewData = {
      invoice: formattedInvoice,
      userData: {
        // Sender fields at root level for pdfService
        displayName: invoiceData.senderName || 'Your Business Name',
        company: invoiceData.senderName || 'Your Business Name',
        email: invoiceData.senderEmail || '',
        phone: invoiceData.senderPhone || '',
        address: {
          street: invoiceData.senderAddress || '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        invoiceSettings: {
          company: invoiceData.senderName || 'Your Business Name',
          invoicePrefix: 'INV',
          displayNameType: 'business', // Default to business name
          currency: invoiceData.currency || 'USD'
        }
      },
      customer: {
        name: invoiceData.customerName,
        email: invoiceData.customerEmail || '',
        address: {
          street: invoiceData.customerAddress || '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      }
    };

    // Generate PDF (same as preview for public users)
    const pdfBase64 = await pdfService.generatePdfPreview(previewData);
    
    res.json({ 
      pdfBase64: pdfBase64.replace(/^data:application\/pdf;base64,/, ''),
      filename: `invoice-${formattedInvoice.invoiceNumber}.pdf`
    });
  } catch (error) {
    logger.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
