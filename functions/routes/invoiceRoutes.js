const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticate } = require('../middleware/auth');
const { invoiceValidators } = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * Invoice routes
 * All routes are protected by authentication middleware
 */

// Get all invoices
router.get(
  '/',
  authenticate,
  invoiceController.getAllInvoices
);

// Get invoice statistics
router.get(
  '/stats',
  authenticate,
  invoiceController.getInvoiceStats
);

// Get invoice by ID
router.get(
  '/:id',
  authenticate,
  invoiceValidators.getById,
  handleValidationErrors,
  invoiceController.getInvoiceById
);

// Generate PDF for invoice
router.get(
  '/:id/pdf',
  authenticate,
  invoiceValidators.getById,
  handleValidationErrors,
  invoiceController.generateInvoicePdf
);

// Preview invoice (generate PDF without saving)
router.post(
  '/preview',
  authenticate,
  invoiceValidators.create,
  handleValidationErrors,
  invoiceController.previewInvoice
);

// Create new invoice
router.post(
  '/',
  authenticate,
  invoiceValidators.create,
  handleValidationErrors,
  invoiceController.createInvoice
);

// Update invoice
router.put(
  '/:id',
  authenticate,
  invoiceValidators.update,
  handleValidationErrors,
  invoiceController.updateInvoice
);

// Update invoice status
router.patch(
  '/:id/status',
  authenticate,
  invoiceValidators.updateStatus,
  handleValidationErrors,
  invoiceController.updateInvoiceStatus
);

// Send invoice via email
router.post(
  '/:id/send',
  authenticate,
  invoiceValidators.getById,
  handleValidationErrors,
  invoiceController.sendInvoice
);

// Delete invoice
router.delete(
  '/:id',
  authenticate,
  invoiceValidators.delete,
  handleValidationErrors,
  invoiceController.deleteInvoice
);

module.exports = router;
