const { db, admin } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');
const { v4: uuidv4 } = require('uuid');
const { 
  addDays, addWeeks, addMonths, addQuarters, addYears, 
  isAfter, isBefore, startOfDay, format, subDays, 
  subWeeks, subMonths, subYears, getWeek, getQuarter 
} = require('date-fns');
const { formatDateForTemplate } = require('../utils/formatters');

class RecurringInvoiceService {
  constructor() {
    this.collection = db.collection('recurringInvoices');
  }

  /**
   * Get all recurring invoices for a user and profile
   */
  async getAllRecurringInvoices(userId, profileId = 'default') {
    let query = this.collection.where('userId', '==', userId);
    
    if (profileId === null) {
      // Personal account - get recurring invoices without profileId
      query = query.orderBy('createdAt', 'desc');
    } else {
      // Business profile - get recurring invoices with specific profileId
      query = query.where('profileId', '==', profileId).orderBy('createdAt', 'desc');
    }
    
    const snapshot = await query.get();

    const recurringInvoices = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // For personal account, only include recurring invoices without profileId
      if (profileId === null && !data.profileId) {
        recurringInvoices.push({ id: doc.id, ...data });
      } else if (profileId !== null) {
        recurringInvoices.push({ id: doc.id, ...data });
      }
    });

    return recurringInvoices;
  }

  /**
   * Get a single recurring invoice by ID
   */
  async getRecurringInvoiceById(recurringInvoiceId, userId, profileId = 'default') {
    const doc = await this.collection.doc(recurringInvoiceId).get();
    
    if (!doc.exists) {
      throw new Error('Recurring invoice not found');
    }

    const recurringInvoice = { id: doc.id, ...doc.data() };
    
    // Verify ownership and profile
    if (recurringInvoice.userId !== userId) {
      throw new Error('Unauthorized access to recurring invoice');
    }
    
    // For personal account, only allow access to recurring invoices without profileId
    if (profileId === null && recurringInvoice.profileId) {
      throw new Error('Unauthorized access to recurring invoice');
    }
    
    // For business profiles, verify profileId matches
    if (profileId !== null && recurringInvoice.profileId !== profileId) {
      throw new Error('Unauthorized access to recurring invoice');
    }

    return recurringInvoice;
  }

  /**
   * Create a new recurring invoice
   */
  async createRecurringInvoice(recurringData, userId, profileId = 'default') {
    // Validate frequency
    const validFrequencies = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];
    if (!validFrequencies.includes(recurringData.frequency)) {
      throw new Error('Invalid frequency. Must be one of: weekly, biweekly, monthly, quarterly, yearly');
    }

    // Calculate next generation date based on frequency and start date
    const startDate = recurringData.startDate ? new Date(recurringData.startDate) : new Date();
    const nextGenerationDate = this.calculateNextGenerationDate(startDate, recurringData.frequency);

    // Create recurring invoice document
    const newRecurringInvoice = {
      userId,
      // Customer info
      customerId: recurringData.customerId,
      customerName: recurringData.customerName,
      customerEmail: recurringData.customerEmail,
      // Invoice template data
      lineItems: recurringData.lineItems || [],
      taxRate: recurringData.taxRate || 0,
      notes: recurringData.notes || '',
      paymentTerms: recurringData.paymentTerms || 'Due on receipt',
      dueDateDuration: recurringData.dueDateDuration || 7,
      // Invoice numbering
      invoicePrefix: recurringData.invoicePrefix || 'INV',
      nextInvoiceNumber: recurringData.nextInvoiceNumber || 1,
      lastInvoiceNumber: null,
      // Recurrence settings
      frequency: recurringData.frequency,
      startDate: startDate.getTime(),
      endDate: recurringData.endDate ? new Date(recurringData.endDate).getTime() : null,
      nextGenerationDate: nextGenerationDate.getTime(),
      lastGeneratedDate: null,
      // Status
      isActive: true,
      pausedUntil: null,
      // Tracking
      generatedInvoiceIds: [],
      totalGenerated: 0,
      // Metadata
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Only add profileId if not personal account
    if (profileId !== null) {
      newRecurringInvoice.profileId = profileId;
    }

    const docRef = await this.collection.add(newRecurringInvoice);
    const createdDoc = await docRef.get();

    return { 
      id: docRef.id, 
      ...createdDoc.data()
    };
  }

  /**
   * Update a recurring invoice
   */
  async updateRecurringInvoice(recurringInvoiceId, updateData, userId, profileId = 'default') {
    // First verify ownership and profile
    await this.getRecurringInvoiceById(recurringInvoiceId, userId, profileId);

    const updates = {
      ...updateData,
      updatedAt: Date.now()
    };

    // If frequency or dates are updated, recalculate next generation date
    if (updates.frequency || updates.startDate) {
      const doc = await this.collection.doc(recurringInvoiceId).get();
      const currentData = doc.data();
      const frequency = updates.frequency || currentData.frequency;
      const lastGenerated = currentData.lastGeneratedDate ? new Date(currentData.lastGeneratedDate) : null;
      const startDate = updates.startDate ? new Date(updates.startDate) : new Date(currentData.startDate);
      
      // Use last generated date if available, otherwise use start date
      const baseDate = lastGenerated || startDate;
      updates.nextGenerationDate = this.calculateNextGenerationDate(baseDate, frequency).getTime();
    }

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.userId;
    delete updates.profileId;
    delete updates.createdAt;
    delete updates.generatedInvoiceIds;
    delete updates.totalGenerated;

    await this.collection.doc(recurringInvoiceId).update(updates);
    
    // Return updated recurring invoice
    return this.getRecurringInvoiceById(recurringInvoiceId, userId, profileId);
  }

  /**
   * Pause a recurring invoice
   */
  async pauseRecurringInvoice(recurringInvoiceId, pauseUntil, userId, profileId = 'default') {
    await this.updateRecurringInvoice(recurringInvoiceId, {
      isActive: false,
      pausedUntil: pauseUntil ? new Date(pauseUntil).getTime() : null
    }, userId, profileId);
  }

  /**
   * Resume a recurring invoice
   */
  async resumeRecurringInvoice(recurringInvoiceId, userId, profileId = 'default') {
    const recurringInvoice = await this.getRecurringInvoiceById(recurringInvoiceId, userId, profileId);
    
    // Calculate new next generation date from today
    const nextGenerationDate = this.calculateNextGenerationDate(new Date(), recurringInvoice.frequency);
    
    await this.updateRecurringInvoice(recurringInvoiceId, {
      isActive: true,
      pausedUntil: null,
      nextGenerationDate: nextGenerationDate.getTime()
    }, userId, profileId);
  }

  /**
   * Stop (delete) a recurring invoice
   */
  async stopRecurringInvoice(recurringInvoiceId, userId, profileId = 'default') {
    // First verify ownership and profile
    await this.getRecurringInvoiceById(recurringInvoiceId, userId, profileId);

    // Delete recurring invoice document
    await this.collection.doc(recurringInvoiceId).delete();
    
    return { success: true };
  }

  /**
   * Get recurring invoices ready for generation
   */
  async getRecurringInvoicesForGeneration() {
    const now = Date.now();
    
    const snapshot = await this.collection
      .where('isActive', '==', true)
      .where('nextGenerationDate', '<=', now)
      .get();

    const readyForGeneration = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Check if not paused
      if (!data.pausedUntil || data.pausedUntil < now) {
        // Check if within date range
        if (!data.endDate || data.endDate >= now) {
          readyForGeneration.push({ id: doc.id, ...data });
        }
      }
    });

    return readyForGeneration;
  }

  /**
   * Mark invoice as generated and update tracking
   */
  async markInvoiceGenerated(recurringInvoiceId, generatedInvoiceId) {
    const doc = await this.collection.doc(recurringInvoiceId).get();
    if (!doc.exists) {
      throw new Error('Recurring invoice not found');
    }

    await this.collection.doc(recurringInvoiceId).update({
      lastGeneratedDate: Date.now(),
      generatedInvoiceIds: FieldValue.arrayUnion(generatedInvoiceId),
      totalGenerated: FieldValue.increment(1),
      updatedAt: Date.now()
    });
  }

  /**
   * Calculate next generation date based on frequency
   */
  calculateNextGenerationDate(fromDate, frequency) {
    const date = new Date(fromDate);
    
    switch (frequency) {
      case 'weekly':
        return addWeeks(date, 1);
      case 'biweekly':
        return addWeeks(date, 2);
      case 'monthly':
        return addMonths(date, 1);
      case 'quarterly':
        return addQuarters(date, 1);
      case 'yearly':
        return addYears(date, 1);
      default:
        throw new Error(`Invalid frequency: ${frequency}`);
    }
  }

  /**
   * Calculate period dates based on frequency
   * For weekly/biweekly: the period ends on the invoice date
   * For monthly: the period is the previous calendar month
   */
  calculatePeriodDates(invoiceDate, frequency) {
    const endDate = new Date(invoiceDate);
    let startDate;
    
    switch (frequency) {
      case 'weekly':
        // Weekly period: 7 days ending on invoice date
        // Invoice on Sep 14 covers Sep 8-14
        // Invoice on Sep 21 covers Sep 15-21
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        break;
      case 'biweekly':
        // Bi-weekly period: 14 days ending on invoice date
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 13);
        break;
      case 'monthly':
        // Monthly invoice covers the previous calendar month
        const tempDate = new Date(endDate);
        tempDate.setMonth(tempDate.getMonth() - 1);
        startDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
        const lastDay = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0);
        return { startDate, endDate: lastDay };
      case 'quarterly':
        // Quarterly period: 3 months ending on invoice date
        startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 3);
        startDate.setDate(startDate.getDate() + 1);
        break;
      case 'yearly':
        // Yearly period: 1 year ending on invoice date
        startDate = new Date(endDate);
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setDate(startDate.getDate() + 1);
        break;
      default:
        startDate = endDate;
    }
    
    return { startDate, endDate };
  }

  /**
   * Update recurring invoice after successful generation
   */
  async updateAfterGeneration(recurringInvoiceId, generatedInvoiceId, lastInvoiceNumber, nextGenerationDate) {
    await this.collection.doc(recurringInvoiceId).update({
      lastGeneratedDate: Date.now(),
      lastInvoiceNumber: lastInvoiceNumber,
      nextGenerationDate: nextGenerationDate.getTime(),
      nextInvoiceNumber: lastInvoiceNumber + 1,
      generatedInvoiceIds: FieldValue.arrayUnion(generatedInvoiceId),
      totalGenerated: admin.firestore.FieldValue.increment(1),
      updatedAt: Date.now()
    });
  }

  /**
   * Process description templates with placeholders
   */
  processDescriptionTemplate(template, invoiceDate, frequency, timezone = 'America/New_York') {
    if (!template) {
      return template;
    }
    
    // Ensure template is a string and not HTML content
    if (typeof template !== 'string') {
      console.error('Invalid template type:', typeof template);
      return String(template);
    }
    
    // Check if template contains HTML (error response)
    if (template.includes('<!DOCTYPE') || template.includes('<html')) {
      console.error('HTML content detected in template:', template.substring(0, 100));
      return ''; // Return empty string instead of processing HTML
    }
    
    // If no template placeholders, return as-is
    if (!template.includes('{{')) {
      return template;
    }
    
    const { startDate, endDate } = this.calculatePeriodDates(invoiceDate, frequency);
    
    // Replace placeholders
    let processed = template;
    
    // Date range placeholders
    processed = processed.replace(/\{\{PERIOD_START\}\}/g, formatDateForTemplate(startDate, 'MMM d', timezone));
    processed = processed.replace(/\{\{PERIOD_END\}\}/g, formatDateForTemplate(endDate, 'MMM d', timezone));
    
    // Month placeholders (use start date for monthly invoices)
    const monthDate = frequency === 'monthly' ? startDate : endDate;
    processed = processed.replace(/\{\{MONTH_NAME\}\}/g, formatDateForTemplate(monthDate, 'MMMM', timezone));
    processed = processed.replace(/\{\{MONTH_SHORT\}\}/g, formatDateForTemplate(monthDate, 'MMM', timezone));
    
    // Year and week placeholders
    processed = processed.replace(/\{\{YEAR\}\}/g, formatDateForTemplate(monthDate, 'yyyy', timezone));
    processed = processed.replace(/\{\{WEEK_NUMBER\}\}/g, getWeek(endDate).toString());
    processed = processed.replace(/\{\{QUARTER\}\}/g, getQuarter(monthDate).toString());
    
    return processed;
  }

  /**
   * Process line items with description templates
   */
  processLineItemsWithTemplates(lineItems, invoiceDate, frequency, timezone = 'America/New_York') {
    if (!lineItems || !Array.isArray(lineItems)) {
      return lineItems;
    }
    
    return lineItems.map(item => ({
      ...item,
      description: this.processDescriptionTemplate(item.description, invoiceDate, frequency, timezone)
    }));
  }
}

module.exports = new RecurringInvoiceService();
