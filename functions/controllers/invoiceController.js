const invoiceService = require('../services/invoiceService');
const userService = require('../services/userService');
const customerService = require('../services/customerService');
const pdfService = require('../services/pdfService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Invoice controller handles HTTP requests for invoice operations
 */
class InvoiceController {
  /**
   * Get all invoices for the authenticated user
   */
  getAllInvoices = asyncHandler(async (req, res) => {
    const invoices = await invoiceService.getAllInvoices(req.user.uid, req.profileId);
    res.json(invoices);
  });

  /**
   * Get a specific invoice by ID
   */
  getInvoiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(id, req.user.uid, req.profileId);
    res.json(invoice);
  });

  /**
   * Preview invoice - generate PDF without saving
   */
  previewInvoice = asyncHandler(async (req, res) => {
    const invoiceData = req.body;
    const userId = req.user.uid;

    // Get customer data
    const customer = await customerService.getCustomerById(invoiceData.customerId, userId, req.profileId);
    
    // Get user data for invoice settings
    let userData = await userService.getUserById(userId);
    
    if (!userData) {
      // Initialize user settings if user doesn't exist
      userData = await userService.initializeUserSettings(userId, req.user.email, req.user.displayName);
    }
    
    // Get profile data if using profile
    const profileData = req.profileId ? userData?.profiles?.find(p => p.id === req.profileId) : null;
    
    // Ensure invoice settings exist
    if (!userData.invoiceSettings) {
      return res.status(400).json({
        error: 'Invoice settings not found',
        message: 'Please complete your profile settings before creating invoices'
      });
    }

    // Debug logging for currency
    console.log('Preview Invoice Data:', {
      requestedCurrency: invoiceData.currency,
      profileCurrency: profileData?.invoiceSettings?.currency,
      userCurrency: userData?.invoiceSettings?.currency,
      defaultCurrency: 'USD'
    });

    // Prepare invoice data for PDF generation in the format expected by PDF service
    const previewData = {
      invoice: {
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.date || new Date(),
        dueDate: invoiceData.dueDate,
        lineItems: invoiceData.lineItems || [],
        taxRate: invoiceData.taxRate || 0,
        notes: invoiceData.notes || '',
        paymentTerms: invoiceData.paymentTerms || 'Due on receipt',
        status: invoiceData.status || 'draft',
        currency: invoiceData.currency || profileData?.invoiceSettings?.currency || userData?.invoiceSettings?.currency || 'USD',
        // Calculate totals
        subtotal: (invoiceData.lineItems || []).reduce((sum, item) => sum + (item.quantity * item.rate), 0),
        taxAmount: 0, // Will be calculated
        total: 0 // Will be calculated
      },
      userData: userData,
      customer: customer,
      profileData: profileData
    };

    // Debug log the final currency being used
    console.log('Final preview currency:', previewData.invoice.currency);

    // Calculate tax and total
    previewData.invoice.taxAmount = (previewData.invoice.subtotal * previewData.invoice.taxRate) / 100;
    previewData.invoice.total = previewData.invoice.subtotal + previewData.invoice.taxAmount;

    // Generate PDF preview (using generatePdfPreview for preview functionality)
    const pdfBase64 = await pdfService.generatePdfPreview(previewData);
    
    // The generatePdfPreview returns a data URL, extract the base64 part
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    
    res.json({ 
      pdf: base64Data,
      mimeType: 'application/pdf'
    });
  });

  /**
   * Create a new invoice with PDF generation
   */
  createInvoice = asyncHandler(async (req, res) => {
    const invoiceData = req.body;
    const userId = req.user.uid;

    // Get customer data
    const customer = await customerService.getCustomerById(invoiceData.customerId, userId, req.profileId);
    
    // Get user data for invoice settings
    let userData = await userService.getUserById(userId);
    
    if (!userData) {
      // Initialize user settings if user doesn't exist
      userData = await userService.initializeUserSettings(userId, req.user.email, req.user.displayName);
    }
    
    // Get profile data if using profile
    const profileData = req.profileId ? userData?.profiles?.find(p => p.id === req.profileId) : null;
    
    // Ensure invoice settings exist
    if (!userData.invoiceSettings) {
      return res.status(400).json({
        error: 'Invoice settings not found',
        message: 'Please complete your profile settings before creating invoices'
      });
    }
    
    if (!userData.invoiceSettings.prefix || !userData.invoiceSettings.nextNumber) {
      return res.status(400).json({
        error: 'Invalid invoice settings',
        message: 'Invoice prefix and number sequence must be configured in your profile'
      });
    }

    // Create invoice
    const invoice = await invoiceService.createInvoice(
      invoiceData,
      userId,
      userData,
      customer,
      req.profileId
    );

    // Update user's next invoice number
    await userService.incrementInvoiceNumber(userId, req.profileId);

    res.status(201).json(invoice);
  });

  /**
   * Update invoice status
   */
  updateInvoiceStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['draft', 'pending', 'paid', 'overdue'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: draft, pending, paid, overdue'
      });
    }
    
    await invoiceService.updateInvoiceStatus(id, status, req.user.uid, req.profileId);
    res.json({ message: 'Invoice status updated successfully' });
  });

  /**
   * Update an invoice
   */
  updateInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove regeneratePdf flag if present (PDFs are now generated on-demand)
    delete updateData.regeneratePdf;
    
    const updatedInvoice = await invoiceService.updateInvoice(id, updateData, req.user.uid, req.profileId);
    res.json(updatedInvoice);
  });

  /**
   * Delete an invoice
   */
  deleteInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await invoiceService.deleteInvoice(id, req.user.uid, req.profileId);
    res.status(204).send();
  });

  /**
   * Get invoice statistics
   */
  getInvoiceStats = asyncHandler(async (req, res) => {
    const stats = await invoiceService.getInvoiceStats(req.user.uid, req.profileId);
    res.json(stats);
  });

  /**
   * Generate PDF for an invoice on-demand
   */
  generateInvoicePdf = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    // Get invoice
    const invoice = await invoiceService.getInvoiceById(id, userId, req.profileId);
    
    // Get customer data
    const customer = await customerService.getCustomerById(invoice.customerId, userId, req.profileId);
    
    // Get user data
    const userData = await userService.getUserById(userId);
    
    // Get profile data if using profile
    const profileData = req.profileId ? userData?.profiles?.find(p => p.id === req.profileId) : null;
    
    // Generate PDF
    const pdfData = {
      invoice,
      userData,
      customer,
      profileData
    };
    
    const pdfBase64 = await pdfService.generateInvoicePDF(pdfData);
    
    // Return base64 PDF data
    res.json({
      pdf: pdfBase64,
      invoiceNumber: invoice.invoiceNumber
    });
  });
}

module.exports = new InvoiceController();
