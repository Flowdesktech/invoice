const { db, admin } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class InvoiceService {
  constructor() {
    this.collection = db.collection('invoices');
  }

  /**
   * Get all invoices for a user and profile
   */
  async getAllInvoices(userId, profileId = 'default') {
    let query = this.collection.where('userId', '==', userId);
    
    if (profileId === null) {
      // Personal account - get invoices without profileId (legacy data)
      // Note: Firestore doesn't have a direct 'field does not exist' query,
      // so we'll filter in memory
      query = query.orderBy('createdAt', 'desc');
    } else {
      // Business profile - get invoices with specific profileId
      query = query.where('profileId', '==', profileId).orderBy('createdAt', 'desc');
    }
    
    const snapshot = await query.get();

    const invoices = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // For personal account, only include invoices without profileId
      if (profileId === null && !data.profileId) {
        invoices.push({ id: doc.id, ...data });
      } else if (profileId !== null) {
        invoices.push({ id: doc.id, ...data });
      }
    });

    return invoices;
  }

  /**
   * Get a single invoice by ID
   */
  async getInvoiceById(invoiceId, userId, profileId = 'default') {
    const doc = await this.collection.doc(invoiceId).get();
    
    if (!doc.exists) {
      throw new Error('Invoice not found');
    }

    const invoice = { id: doc.id, ...doc.data() };
    
    // Verify ownership and profile
    if (invoice.userId !== userId) {
      throw new Error('Unauthorized access to invoice');
    }
    
    // For personal account, only allow access to invoices without profileId
    if (profileId === null && invoice.profileId) {
      throw new Error('Unauthorized access to invoice');
    }
    
    // For business profiles, verify profileId matches
    if (profileId !== null && invoice.profileId !== profileId) {
      throw new Error('Unauthorized access to invoice');
    }

    return invoice;
  }

  /**
   * Create a new invoice
   */
  async createInvoice(invoiceData, userId, userData, customerData, profileId = 'default') {
    // Validate invoice settings
    if (!userData?.invoiceSettings?.prefix || !userData?.invoiceSettings?.nextNumber) {
      throw new Error('Invalid user invoice settings. Please configure invoice settings in your profile.');
    }
    
    // Use provided invoice number or generate a new one based on auto-increment setting
    let invoiceNumber;
    if (invoiceData.invoiceNumber) {
      // Always use provided invoice number if available
      // Extract just the number if it includes a prefix
      const match = String(invoiceData.invoiceNumber).match(/^[A-Z]+-?(\d+)$/);
      invoiceNumber = match ? parseInt(match[1], 10) : parseInt(invoiceData.invoiceNumber, 10);
    } else if (userData.invoiceSettings.autoIncrementNumber !== false) {
      // Generate number if auto-increment is enabled (default true)
      invoiceNumber = userData.invoiceSettings.nextNumber || 1;
    } else {
      // If auto-increment is disabled and no number provided, throw error
      throw new Error('Invoice number is required when auto-increment is disabled');
    }

    // Calculate totals
    const lineItems = invoiceData.lineItems || [];
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxRate = invoiceData.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    // Create invoice document
    const newInvoice = {
      userId,
      customerId: invoiceData.customerId,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerAddress: customerData.address || {},
      invoiceNumber,
      date: invoiceData.date,
      dueDate: invoiceData.dueDate,
      status: invoiceData.status || 'draft',
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      notes: invoiceData.notes || '',
      paymentTerms: invoiceData.paymentTerms || userData.invoiceSettings?.paymentTerms || 'Due on receipt',
      currency: invoiceData.currency || userData.invoiceSettings?.currency || 'USD',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Only add profileId if not personal account
    if (profileId !== null) {
      newInvoice.profileId = profileId;
    }

    const docRef = await this.collection.add(newInvoice);
    const createdDoc = await docRef.get();

    return { 
      id: docRef.id, 
      ...createdDoc.data(),
      invoiceNumber
    };
  }

  /**
   * Update invoice status
   */
  async updateInvoiceStatus(invoiceId, status, userId) {
    // First verify ownership
    await this.getInvoiceById(invoiceId, userId);

    await this.collection.doc(invoiceId).update({
      status,
      updatedAt: Date.now()
    });

    return { success: true };
  }

  /**
   * Update an invoice
   */
  async updateInvoice(invoiceId, updateData, userId, profileId = 'default') {
    // First verify ownership and profile
    await this.getInvoiceById(invoiceId, userId, profileId);

    const updates = {
      ...updateData,
      updatedAt: Date.now()
    };

    // Convert date strings to timestamps
    if (updates.date) {
      updates.date = new Date(updates.date).getTime();
    }
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate).getTime();
    }

    // Recalculate totals if line items or tax rate changed
    if (updates.lineItems || updates.taxRate !== undefined) {
      const lineItems = updates.lineItems || (await this.getInvoiceById(invoiceId, userId, profileId)).lineItems;
      const taxRate = updates.taxRate !== undefined ? updates.taxRate : (await this.getInvoiceById(invoiceId, userId, profileId)).taxRate;
      
      updates.subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      updates.taxAmount = (updates.subtotal * taxRate) / 100;
      updates.total = updates.subtotal + updates.taxAmount;
    }

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.userId;
    delete updates.profileId;
    delete updates.createdAt;

    await this.collection.doc(invoiceId).update(updates);
    
    // Return updated invoice
    return this.getInvoiceById(invoiceId, userId, profileId);
  }

  /**
   * Delete an invoice
   */
  async deleteInvoice(invoiceId, userId, profileId = 'default') {
    // First verify ownership and profile
    const invoice = await this.getInvoiceById(invoiceId, userId, profileId);

    // Delete invoice document
    await this.collection.doc(invoiceId).delete();
    
    return { success: true };
  }

  /**
   * Get invoice statistics for a user and profile
   */
  async getInvoiceStats(userId, profileId = 'default') {
    const invoices = await this.getAllInvoices(userId, profileId);
    
    const stats = {
      total: invoices.length,
      paid: 0,
      pending: 0,
      overdue: 0,
      draft: 0,
      totalRevenue: 0,
      pendingRevenue: 0
    };

    const now = new Date();

    invoices.forEach(invoice => {
      stats[invoice.status] = (stats[invoice.status] || 0) + 1;
      
      if (invoice.status === 'paid') {
        stats.totalRevenue += invoice.total || 0;
      } else if (invoice.status === 'pending') {
        stats.pendingRevenue += invoice.total || 0;
        
        // Check if overdue
        if (invoice.dueDate && new Date(invoice.dueDate) < now) {
          stats.overdue++;
          stats.pending--;
        }
      }
    });

    return stats;
  }
}

module.exports = new InvoiceService();
