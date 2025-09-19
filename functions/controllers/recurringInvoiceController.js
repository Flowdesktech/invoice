const recurringInvoiceService = require('../services/recurringInvoiceService');
const invoiceService = require('../services/invoiceService');
const customerService = require('../services/customerService');
const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('firebase-functions/v2');
const { db } = require('../config/firebase');

/**
 * Recurring Invoice controller handles HTTP requests for recurring invoice operations
 */
class RecurringInvoiceController {
  /**
   * Get all recurring invoices for the authenticated user
   */
  getAllRecurringInvoices = asyncHandler(async (req, res) => {
    const recurringInvoices = await recurringInvoiceService.getAllRecurringInvoices(req.user.uid, req.profileId);
    res.json(recurringInvoices);
  });

  /**
   * Get a specific recurring invoice by ID
   */
  getRecurringInvoiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recurringInvoice = await recurringInvoiceService.getRecurringInvoiceById(id, req.user.uid, req.profileId);
    res.json(recurringInvoice);
  });

  /**
   * Create a new recurring invoice from an existing invoice
   */
  createRecurringInvoice = asyncHandler(async (req, res) => {
    const recurringData = req.body;
    const userId = req.user.uid;

    // If creating from an existing invoice, fetch its data
    if (recurringData.fromInvoiceId) {
      const invoice = await invoiceService.getInvoiceById(recurringData.fromInvoiceId, userId, req.profileId);
      
      // Copy relevant fields from the invoice
      recurringData.customerId = invoice.customerId;
      recurringData.customerName = invoice.customerName;
      recurringData.customerEmail = invoice.customerEmail;
      recurringData.lineItems = invoice.lineItems;
      recurringData.taxRate = invoice.taxRate;
      recurringData.notes = invoice.notes;
      recurringData.paymentTerms = invoice.paymentTerms;
      recurringData.nextInvoiceNumber = parseInt(invoice.invoiceNumber) + 1;
    }

    // Validate customer exists
    if (recurringData.customerId) {
      const customer = await customerService.getCustomerById(recurringData.customerId, userId, req.profileId);
      recurringData.customerName = customer.name;
      recurringData.customerEmail = customer.email;
    }

    // Get user settings for default due date duration and invoice prefix
    const userData = await userService.getUserById(userId);
    recurringData.dueDateDuration = recurringData.dueDateDuration || userData?.invoiceSettings?.dueDateDuration || 7;
    
    // Get invoice prefix from user settings or current profile
    const profileData = req.profileId ? userData?.profiles?.find(p => p.id === req.profileId) : null;
    const invoiceSettings = profileData?.invoiceSettings || userData?.invoiceSettings || {};
    recurringData.invoicePrefix = recurringData.invoicePrefix || invoiceSettings.prefix || 'INV';
    
    // For new recurring invoices, start numbering from where the user left off
    if (!recurringData.nextInvoiceNumber && invoiceSettings.nextNumber) {
      recurringData.nextInvoiceNumber = invoiceSettings.nextNumber;
    }

    const newRecurringInvoice = await recurringInvoiceService.createRecurringInvoice(
      recurringData,
      userId,
      req.profileId
    );

    res.status(201).json(newRecurringInvoice);
  });

  /**
   * Update a recurring invoice
   */
  updateRecurringInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedRecurringInvoice = await recurringInvoiceService.updateRecurringInvoice(
      id, 
      updateData, 
      req.user.uid, 
      req.profileId
    );
    
    res.json(updatedRecurringInvoice);
  });

  /**
   * Pause a recurring invoice
   */
  pauseRecurringInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { pauseUntil } = req.body;
    
    await recurringInvoiceService.pauseRecurringInvoice(id, pauseUntil, req.user.uid, req.profileId);
    res.json({ message: 'Recurring invoice paused successfully' });
  });

  /**
   * Resume a recurring invoice
   */
  resumeRecurringInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await recurringInvoiceService.resumeRecurringInvoice(id, req.user.uid, req.profileId);
    res.json({ message: 'Recurring invoice resumed successfully' });
  });

  /**
   * Stop (delete) a recurring invoice
   */
  stopRecurringInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await recurringInvoiceService.stopRecurringInvoice(id, req.user.uid, req.profileId);
    res.status(204).send();
  });

  /**
   * Manually generate next invoice from recurring template
   */
  generateNextInvoice = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.uid;
      
      // Get recurring invoice
      const recurringInvoice = await recurringInvoiceService.getRecurringInvoiceById(id, userId, req.profileId);
      if (!recurringInvoice) {
        const error = new Error('Recurring invoice not found');
        error.statusCode = 404;
        throw error;
      }
      
      // Generate invoice using shared logic
      const invoice = await this._generateInvoiceFromRecurring(recurringInvoice, id);
      
      res.json({
        message: 'Invoice generated successfully',
        invoice: invoice
      });
    } catch (error) {
      // Let the errorHandler middleware handle the error with proper status code
      throw error;
    }
  });

  /**
   * Get generated invoices for a recurring invoice
   */
  getGeneratedInvoices = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;
    
    // Get recurring invoice to access generated invoice IDs
    const recurringInvoice = await recurringInvoiceService.getRecurringInvoiceById(id, userId, req.profileId);
    
    // Fetch all generated invoices
    const generatedInvoices = [];
    for (const invoiceId of recurringInvoice.generatedInvoiceIds) {
      try {
        const invoice = await invoiceService.getInvoiceById(invoiceId, userId, req.profileId);
        generatedInvoices.push(invoice);
      } catch (error) {
        // Skip if invoice not found (might have been deleted)
        logger.warn('Generated invoice not found', {
          invoiceId: invoiceId,
          error: error.message,
          recurringInvoiceId: id
        });
      }
    }
    
    res.json(generatedInvoices);
  });

  /**
   * Process scheduled recurring invoice generation (called by scheduled function)
   * Not an HTTP endpoint - used internally by scheduled functions
   */
  processScheduledGeneration = async () => {
    logger.info('Starting automatic recurring invoice generation');
    
    try {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      
      // Query all active recurring invoices where nextGenerationDate <= today
      const recurringInvoicesSnapshot = await db.collection('recurringInvoices')
        .where('isActive', '==', true)
        .where('nextGenerationDate', '<=', todayTimestamp)
        .get();
      
      logger.info(`Found ${recurringInvoicesSnapshot.size} recurring invoices due for generation`);
      
      const results = {
        successful: 0,
        failed: 0,
        errors: []
      };
      
      // Process each recurring invoice
      for (const doc of recurringInvoicesSnapshot.docs) {
        const recurringInvoice = { id: doc.id, ...doc.data() };
        
        try {
          // Check if invoice should still be generated (endDate check)
          if (recurringInvoice.endDate && recurringInvoice.endDate < todayTimestamp) {
            logger.info(`Skipping recurring invoice ${doc.id}: past end date`);
            continue;
          }
          
          // Check if invoice is paused
          if (recurringInvoice.pausedUntil && recurringInvoice.pausedUntil > todayTimestamp) {
            logger.info(`Skipping recurring invoice ${doc.id}: paused until ${new Date(recurringInvoice.pausedUntil).toISOString()}`);
            continue;
          }
          
          logger.info(`Processing recurring invoice ${doc.id} for customer ${recurringInvoice.customerName}`);
          
          // Generate the invoice using existing logic
          await this._generateInvoiceFromRecurring(recurringInvoice, doc.id);
          
          results.successful++;
          logger.info(`Successfully generated invoice for recurring invoice ${doc.id}`);
          
        } catch (error) {
          logger.error(`Error generating invoice for recurring invoice ${doc.id}:`, error);
          results.failed++;
          results.errors.push({
            recurringInvoiceId: doc.id,
            customerName: recurringInvoice.customerName,
            error: error.message
          });
        }
      }
      
      logger.info('Recurring invoice generation completed:', results);
      return results;
      
    } catch (error) {
      logger.error('Fatal error in recurring invoice generation:', error);
      throw new Error(`Scheduled generation failed: ${error.message}`);
    }
  };

  /**
   * Internal method to generate invoice from recurring invoice
   * Extracted from generateNextInvoice for reusability
   */
  _generateInvoiceFromRecurring = async (recurringInvoice, recurringInvoiceId) => {
    // Get user data
    const userData = await userService.getUserById(recurringInvoice.userId);
    if (!userData) {
      const error = new Error(`User account not found for recurring invoice`);
      error.statusCode = 404;
      logger.error('User not found for recurring invoice', {
        userId: recurringInvoice.userId,
        recurringInvoiceId: recurringInvoiceId
      });
      throw error;
    }
    
    // Get customer data
    const customer = await customerService.getCustomerById(
      recurringInvoice.customerId, 
      recurringInvoice.userId,
      recurringInvoice.profileId
    );
    
    if (!customer) {
      const error = new Error(`Customer not found. The customer may have been deleted.`);
      error.statusCode = 404;
      logger.error('Customer not found for recurring invoice', {
        customerId: recurringInvoice.customerId,
        recurringInvoiceId: recurringInvoiceId
      });
      throw error;
    }
    
    // Determine invoice date and number
    let invoiceDate;
    let invoiceNumber;
    let lastInvoiceData = null;
    
    if (recurringInvoice.generatedInvoiceIds && recurringInvoice.generatedInvoiceIds.length > 0) {
      // Get last generated invoice to calculate next invoice date
      const lastInvoiceId = recurringInvoice.generatedInvoiceIds[recurringInvoice.generatedInvoiceIds.length - 1];
      try {
        lastInvoiceData = await invoiceService.getInvoiceById(
          lastInvoiceId, 
          recurringInvoice.userId,
          recurringInvoice.profileId
        );
        
        const lastInvoiceDate = new Date(lastInvoiceData.date);
        invoiceDate = recurringInvoiceService.calculateNextGenerationDate(
          lastInvoiceDate, 
          recurringInvoice.frequency
        );
        
        // Extract and increment invoice number
        const lastInvoiceNumber = lastInvoiceData.invoiceNumber;
        if (typeof lastInvoiceNumber === 'number') {
          invoiceNumber = lastInvoiceNumber + 1;
        } else {
          const match = String(lastInvoiceNumber).match(/([0-9]+)$/);
          invoiceNumber = match ? parseInt(match[1], 10) + 1 : recurringInvoice.nextInvoiceNumber;
        }
      } catch (error) {
        logger.warn('Error fetching last invoice, using defaults', {
          error: error.message,
          lastInvoiceId: lastInvoiceId
        });
        invoiceDate = new Date(recurringInvoice.nextGenerationDate);
        invoiceNumber = recurringInvoice.nextInvoiceNumber;
      }
    } else {
      // First invoice generation
      invoiceDate = new Date(recurringInvoice.nextGenerationDate);
      invoiceNumber = recurringInvoice.nextInvoiceNumber;
    }
    
    // Get timezone for template processing
    const profileData = recurringInvoice.profileId ? 
      userData?.profiles?.find(p => p.id === recurringInvoice.profileId) : null;
    const timezone = profileData?.invoiceSettings?.timezone || 
                     userData?.invoiceSettings?.timezone || 
                     'America/New_York';
    
    // Process line items with templates
    const processedLineItems = recurringInvoiceService.processLineItemsWithTemplates(
      recurringInvoice.lineItems,
      invoiceDate,
      recurringInvoice.frequency,
      timezone
    );
    
    // Validate line items
    if (!processedLineItems || processedLineItems.length === 0) {
      const error = new Error('No line items found in recurring invoice');
      error.statusCode = 400;
      throw error;
    }
    
    // Create invoice data
    const invoiceData = {
      customerId: recurringInvoice.customerId,
      lineItems: processedLineItems,
      taxRate: recurringInvoice.taxRate || 0,
      notes: recurringInvoice.notes || '',
      paymentTerms: recurringInvoice.paymentTerms || 'Due on receipt',
      date: invoiceDate.getTime(),
      dueDate: invoiceDate.getTime() + ((recurringInvoice.dueDateDuration || 7) * 24 * 60 * 60 * 1000),
      status: 'pending',
      recurringInvoiceId: recurringInvoiceId,
      invoiceNumber: invoiceNumber,
      templateId: recurringInvoice.templateId || 'default'
    };
    
    // Create the invoice
    const invoice = await invoiceService.createInvoice(
      invoiceData,
      recurringInvoice.userId,
      userData,
      customer,
      recurringInvoice.profileId
    );
    
    // Update recurring invoice
    const nextDate = recurringInvoiceService.calculateNextGenerationDate(
      invoiceDate,
      recurringInvoice.frequency
    );
    
    await recurringInvoiceService.updateAfterGeneration(
      recurringInvoiceId,
      invoice.id,
      invoiceNumber,
      nextDate
    );
    
    // Increment invoice number for the user/profile
    await userService.incrementInvoiceNumber(
      recurringInvoice.userId,
      recurringInvoice.profileId
    );
    
    return invoice;
  };
}

module.exports = new RecurringInvoiceController();
