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
    const customerData = req.body;
    const newCustomer = await customerService.createCustomer(customerData, req.user.uid, req.profileId);
    res.status(201).json(newCustomer);
  });

  /**
   * Update an existing customer
   */
  updateCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCustomer = await customerService.updateCustomer(id, updateData, req.user.uid, req.profileId);
    res.json(updatedCustomer);
  });

  /**
   * Delete a customer
   */
  deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if customer has invoices
    const hasInvoices = await customerService.hasInvoices(id);
    if (hasInvoices) {
      return res.status(400).json({
        error: 'Cannot delete customer',
        message: 'This customer has associated invoices. Delete all invoices first.'
      });
    }
    
    await customerService.deleteCustomer(id, req.user.uid, req.profileId);
    res.status(204).send();
  });
}

module.exports = new CustomerController();
