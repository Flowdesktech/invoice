const customerService = require('../services/customerService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Customer controller handles HTTP requests for customer operations
 */
class CustomerController {
  /**
   * Get all customers for the authenticated user
   */
  getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await customerService.getAllCustomers(req.user.uid, req.profileId);
    res.json(customers);
  });

  /**
   * Get a specific customer by ID
   */
  getCustomerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id, req.user.uid, req.profileId);
    res.json(customer);
  });

  /**
   * Create a new customer
   */
  createCustomer = asyncHandler(async (req, res) => {
    try {
      const customerData = req.body;
      
      // Validate required fields
      if (!customerData.name) {
        const error = new Error('Customer name is required');
        error.statusCode = 400;
        throw error;
      }
      
      if (!customerData.email && !customerData.phone) {
        const error = new Error('At least one contact method (email or phone) is required');
        error.statusCode = 400;
        throw error;
      }
      
      if (customerData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerData.email)) {
          const error = new Error('Invalid email address format');
          error.statusCode = 400;
          throw error;
        }
      }
      
      const newCustomer = await customerService.createCustomer(customerData, req.user.uid, req.profileId);
      res.status(201).json(newCustomer);
    } catch (error) {
      throw error;
    }
  });

  /**
   * Update an existing customer
   */
  updateCustomer = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Validate email if provided
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          const error = new Error('Invalid email address format');
          error.statusCode = 400;
          throw error;
        }
      }
      
      const updatedCustomer = await customerService.updateCustomer(id, updateData, req.user.uid, req.profileId);
      res.json(updatedCustomer);
    } catch (error) {
      throw error;
    }
  });

  /**
   * Delete a customer
   */
  deleteCustomer = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if customer has invoices
      const hasInvoices = await customerService.hasInvoices(id);
      if (hasInvoices) {
        const error = new Error('This customer has associated invoices. Delete all invoices first.');
        error.statusCode = 400;
        throw error;
      }
      
      await customerService.deleteCustomer(id, req.user.uid, req.profileId);
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  });
}

module.exports = new CustomerController();
