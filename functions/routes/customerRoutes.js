const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate } = require('../middleware/auth');
const { customerValidators } = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * Customer routes
 * All routes are protected by authentication middleware
 */

// Get all customers
router.get(
  '/',
  authenticate,
  customerController.getAllCustomers
);

// Get customer by ID
router.get(
  '/:id',
  authenticate,
  customerValidators.getById,
  handleValidationErrors,
  customerController.getCustomerById
);

// Create new customer
router.post(
  '/',
  authenticate,
  customerValidators.create,
  handleValidationErrors,
  customerController.createCustomer
);

// Update customer
router.put(
  '/:id',
  authenticate,
  customerValidators.update,
  handleValidationErrors,
  customerController.updateCustomer
);

// Delete customer
router.delete(
  '/:id',
  authenticate,
  customerValidators.delete,
  handleValidationErrors,
  customerController.deleteCustomer
);

module.exports = router;
