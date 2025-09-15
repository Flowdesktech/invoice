const { body, param, query } = require('express-validator');

/**
 * Validation schemas for all routes
 */

// Customer validation schemas
const customerValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('Customer name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('company').optional().trim(),
    body('address.street').optional().trim(),
    body('address.city').optional().trim(),
    body('address.state').optional().trim(),
    body('address.zipCode').optional().trim(),
    body('address.country').optional().trim()
  ],
  
  update: [
    param('id').notEmpty().withMessage('Customer ID is required'),
    body('name').optional().trim().notEmpty().withMessage('Customer name cannot be empty'),
    body('email').optional().trim().isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('company').optional().trim(),
    body('address.street').optional().trim(),
    body('address.city').optional().trim(),
    body('address.state').optional().trim(),
    body('address.zipCode').optional().trim(),
    body('address.country').optional().trim()
  ],
  
  getById: [
    param('id').notEmpty().withMessage('Customer ID is required')
  ],
  
  delete: [
    param('id').notEmpty().withMessage('Customer ID is required')
  ]
};

// Invoice validation schemas
const invoiceValidators = {
  create: [
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('lineItems').isArray({ min: 1 }).withMessage('At least one line item is required'),
    body('lineItems.*.description').trim().notEmpty().withMessage('Line item description is required'),
    body('lineItems.*.quantity').isFloat({ min: 0 }).withMessage('Valid quantity is required'),
    body('lineItems.*.rate').isFloat({ min: 0 }).withMessage('Valid rate is required'),
    body('taxRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100'),
    body('date').isInt({ min: 0 }).withMessage('Valid invoice date timestamp is required'),
    body('dueDate').isInt({ min: 0 }).withMessage('Valid due date timestamp is required'),
    body('status').optional().isIn(['draft', 'pending', 'paid', 'overdue']).withMessage('Invalid status'),
    body('notes').optional().trim(),
    body('paymentTerms').optional().trim(),
    body('currency').optional().trim().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code')
  ],
  
  updateStatus: [
    param('id').notEmpty().withMessage('Invoice ID is required'),
    body('status').isIn(['draft', 'pending', 'paid', 'overdue']).withMessage('Invalid status')
  ],
  
  update: [
    param('id').notEmpty().withMessage('Invoice ID is required'),
    body('lineItems').optional().isArray({ min: 1 }).withMessage('At least one line item is required'),
    body('lineItems.*.description').optional().trim().notEmpty().withMessage('Line item description is required'),
    body('lineItems.*.quantity').optional().isFloat({ min: 0 }).withMessage('Valid quantity is required'),
    body('lineItems.*.rate').optional().isFloat({ min: 0 }).withMessage('Valid rate is required'),
    body('taxRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100'),
    body('date').optional().isInt({ min: 0 }).withMessage('Valid invoice date timestamp is required'),
    body('dueDate').optional().isInt({ min: 0 }).withMessage('Valid due date timestamp is required'),
    body('status').optional().isIn(['draft', 'pending', 'paid', 'overdue']).withMessage('Invalid status'),
    body('notes').optional().trim(),
    body('paymentTerms').optional().trim(),
    body('currency').optional().trim().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code')
  ],
  
  getById: [
    param('id').notEmpty().withMessage('Invoice ID is required')
  ],
  
  delete: [
    param('id').notEmpty().withMessage('Invoice ID is required')
  ]
};

// User/Profile validation schemas
const userValidators = {
  updateProfile: [
    body('displayName').optional().trim(),
    body('company').optional().trim(),
    body('phone').optional().trim(),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('address.street').optional().trim(),
    body('address.city').optional().trim(),
    body('address.state').optional().trim(),
    body('address.zipCode').optional().trim(),
    body('address.country').optional().trim(),
    body('invoiceSettings.prefix').optional().trim().notEmpty().withMessage('Invoice prefix cannot be empty'),
    body('invoiceSettings.nextNumber').optional().isInt({ min: 1 }).withMessage('Next invoice number must be at least 1'),
    body('invoiceSettings.taxRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100'),
    body('invoiceSettings.currency').optional().trim().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
    body('invoiceSettings.paymentTerms').optional().trim()
  ]
};

module.exports = {
  customerValidators,
  invoiceValidators,
  userValidators
};
