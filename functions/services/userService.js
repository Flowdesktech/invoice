const { db, admin } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

class UserService {
  constructor() {
    this.collection = db.collection('users');
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const doc = await this.collection.doc(userId).get();
    
    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  }

  /**
   * Create or update user profile
   */
  async updateUserProfile(userId, profileData) {
    const updates = {
      ...profileData,
      updatedAt: Date.now()
    };

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.uid;
    delete updates.createdAt;

    // Use set with merge to create if doesn't exist
    await this.collection.doc(userId).set(updates, { merge: true });
    
    // Return updated user
    return this.getUserById(userId);
  }

  /**
   * Increment invoice number for user
   */
  async incrementInvoiceNumber(userId) {
    await this.collection.doc(userId).update({
      'invoiceSettings.nextNumber': FieldValue.increment(1)
    });
  }

  /**
   * Get user statistics for a specific profile
   */
  async getUserStats(userId, profileId = 'default') {
    let customersQuery = db.collection('customers').where('userId', '==', userId);
    let invoicesQuery = db.collection('invoices').where('userId', '==', userId);
    
    if (profileId !== null) {
      // Business profile - filter by specific profileId
      customersQuery = customersQuery.where('profileId', '==', profileId);
      invoicesQuery = invoicesQuery.where('profileId', '==', profileId);
    }
    
    const [customersSnapshot, invoicesSnapshot] = await Promise.all([
      customersQuery.get(),
      invoicesQuery.get()
    ]);

    // For personal account, we need to filter out items with profileId
    let customerDocs = [];
    let invoiceDocs = [];
    
    customersSnapshot.forEach(doc => {
      const data = doc.data();
      if (profileId === null && !data.profileId) {
        customerDocs.push(data);
      } else if (profileId !== null) {
        customerDocs.push(data);
      }
    });
    
    invoicesSnapshot.forEach(doc => {
      const data = doc.data();
      if (profileId === null && !data.profileId) {
        invoiceDocs.push(data);
      } else if (profileId !== null) {
        invoiceDocs.push(data);
      }
    });
    
    const stats = {
      totalCustomers: customerDocs.length,
      totalInvoices: invoiceDocs.length,
      totalRevenue: 0,
      pendingRevenue: 0
    };

    invoiceDocs.forEach(invoice => {
      if (invoice.status === 'paid') {
        stats.totalRevenue += invoice.total || 0;
      } else if (invoice.status === 'pending') {
        stats.pendingRevenue += invoice.total || 0;
      }
    });

    return stats;
  }

  /**
   * Initialize default user settings
   */
  async initializeUserSettings(userId, email, displayName = '') {
    const defaultSettings = {
      uid: userId,
      email,
      displayName,
      invoiceSettings: {
        prefix: 'INV',
        nextNumber: 1,
        taxRate: 0,
        currency: 'USD',
        paymentTerms: 'Due on receipt',
        dueDateDuration: 7,  // Default 7 days for due date
        autoIncrementNumber: true  // Default to auto-increment enabled
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await this.collection.doc(userId).set(defaultSettings, { merge: true });
    return this.getUserById(userId);
  }
}

module.exports = new UserService();
