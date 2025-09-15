const express = require('express');
const router = express.Router();
const recurringInvoiceController = require('../controllers/recurringInvoiceController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all recurring invoices
router.get('/', recurringInvoiceController.getAllRecurringInvoices);

// Get a specific recurring invoice
router.get('/:id', recurringInvoiceController.getRecurringInvoiceById);

// Create a new recurring invoice
router.post('/', recurringInvoiceController.createRecurringInvoice);

// Update a recurring invoice
router.put('/:id', recurringInvoiceController.updateRecurringInvoice);

// Pause a recurring invoice
router.post('/:id/pause', recurringInvoiceController.pauseRecurringInvoice);

// Resume a recurring invoice
router.post('/:id/resume', recurringInvoiceController.resumeRecurringInvoice);

// Stop (delete) a recurring invoice
router.delete('/:id', recurringInvoiceController.stopRecurringInvoice);

// Manually generate next invoice
router.post('/:id/generate', recurringInvoiceController.generateNextInvoice);

// Get generated invoices for a recurring invoice
router.get('/:id/invoices', recurringInvoiceController.getGeneratedInvoices);

module.exports = router;
