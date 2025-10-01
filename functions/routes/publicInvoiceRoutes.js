const express = require('express');
const router = express.Router();
const publicInvoiceController = require('../controllers/publicInvoiceController');

// Public routes (no authentication required)
router.post('/public/invoices/preview', publicInvoiceController.preview);
router.post('/public/invoices/generate-pdf', publicInvoiceController.generatePdf);

module.exports = router;
