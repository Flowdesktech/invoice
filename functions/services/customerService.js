const { db, admin } = require('../config/firebase');
const { logger } = require('firebase-functions/v2');

class CustomerService {
  constructor() {
    this.collection = db.collection('customers');
  }

  /**
   * Get all customers for a user and profile
   */
  async getAllCustomers(userId, profileId) {
    try {
      let query = this.collection.where('userId', '==', userId);
      
      if (profileId === null) {
        // Personal account - get customers without profileId (legacy data)
        query = query.orderBy('createdAt', 'desc');
      } else {
        // Business profile - get customers with specific profileId
        query = query.where('profileId', '==', profileId).orderBy('createdAt', 'desc');
      }
      
      const snapshot = await query.get();

      const customers = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        // For personal account, only include customers without profileId
        if (profileId === null && !data.profileId) {
          customers.push({ id: doc.id, ...data });
        } else if (profileId !== null) {
          customers.push({ id: doc.id, ...data });
        }
      });

      return customers;
    } catch (error) {
      logger.error('Error in getAllCustomers', {
        userId,
        profileId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Get a single customer by ID
   */
  async getCustomerById(customerId, userId, profileId) {
    try {
      const doc = await this.collection.doc(customerId).get();
      
      if (!doc.exists) {
        const error = new Error('Customer not found');
        error.statusCode = 404;
        throw error;
      }

      const customer = { id: doc.id, ...doc.data() };
      
      // Verify ownership
      if (customer.userId !== userId) {
        const error = new Error('Unauthorized access to customer');
        error.statusCode = 403;
        throw error;
      }
      
      // For personal account, only allow access to customers without profileId
      if (profileId === null && customer.profileId) {
        const error = new Error('Unauthorized access to customer');
        error.statusCode = 403;
        throw error;
      }
      
      // For business profiles, verify profileId matches
      if (profileId !== null && customer.profileId !== profileId) {
        const error = new Error('Unauthorized access to customer');
        error.statusCode = 403;
        throw error;
      }

      return customer;
    } catch (error) {
      logger.error('Error in getCustomerById', {
        customerId,
        userId,
        profileId,
        error: error.message,
        statusCode: error.statusCode,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Create a new customer
   */
  async createCustomer(customerData, userId, profileId) {
    const newCustomer = {
      ...customerData,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Only add profileId if not personal account
    if (profileId !== null) {
      newCustomer.profileId = profileId;
    }

    const docRef = await this.collection.add(newCustomer);
    const createdDoc = await docRef.get();

    return { id: docRef.id, ...createdDoc.data() };
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(customerId, updateData, userId, profileId) {
    // First verify ownership and profile
    await this.getCustomerById(customerId, userId, profileId);

    const updates = {
      ...updateData,
      updatedAt: Date.now()
    };

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.userId;
    delete updates.profileId;
    delete updates.createdAt;

    await this.collection.doc(customerId).update(updates);
    
    // Return updated customer
    return this.getCustomerById(customerId, userId, profileId);
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(customerId, userId, profileId) {
    // First verify ownership and profile
    await this.getCustomerById(customerId, userId, profileId);

    await this.collection.doc(customerId).delete();
    
    return { success: true };
  }

  /**
   * Check if any invoices exist for this customer
   */
  async hasInvoices(customerId) {
    const invoicesSnapshot = await db.collection('invoices')
      .where('customerId', '==', customerId)
      .limit(1)
      .get();

    return !invoicesSnapshot.empty;
  }
}

module.exports = new CustomerService();
