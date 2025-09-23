const recurringInvoiceController = require('../controllers/recurringInvoiceController');
const { logger } = require('firebase-functions/v2');

// Mock all dependencies
jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn()
  },
  admin: {
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn(),
        arrayUnion: jest.fn(),
        increment: jest.fn()
      }
    }
  }
}));

jest.mock('../services/recurringInvoiceService');
jest.mock('../services/invoiceService');
jest.mock('../services/customerService');
jest.mock('../services/userService');
jest.mock('firebase-functions/v2', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

const { db } = require('../config/firebase');
const recurringInvoiceService = require('../services/recurringInvoiceService');
const invoiceService = require('../services/invoiceService');
const customerService = require('../services/customerService');
const userService = require('../services/userService');

describe('Recurring Invoice Generation - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processScheduledGeneration', () => {
    it('should successfully process recurring invoices and verify profileId handling', async () => {
      // Mock date - use local midnight to match what the controller does
      const mockToday = new Date();
      mockToday.setHours(0, 0, 0, 0);
      const todayTimestamp = mockToday.getTime();

      // Mock recurring invoices data
      const mockRecurringInvoices = [
        {
          id: 'rec1',
          userId: 'user1',
          profileId: 'profile1', // Business profile
          customerId: 'cust1',
          customerName: 'Test Customer 1',
          frequency: 'weekly',
          isActive: true,
          nextGenerationDate: todayTimestamp - 86400000, // Yesterday
          lineItems: [{ description: 'Service 1', amount: 100, quantity: 1 }],
          taxRate: 10,
          nextInvoiceNumber: 1001
        },
        {
          id: 'rec2',
          userId: 'user2',
          profileId: null, // Personal account
          customerId: 'cust2',
          customerName: 'Test Customer 2',
          frequency: 'monthly',
          isActive: true,
          nextGenerationDate: todayTimestamp - 86400000,
          lineItems: [{ description: 'Service 2', amount: 200, quantity: 1 }],
          taxRate: 5,
          nextInvoiceNumber: 2001
        }
      ];

      // Mock Firestore query
      const mockSnapshot = {
        size: mockRecurringInvoices.length,
        docs: mockRecurringInvoices.map(invoice => ({
          id: invoice.id,
          data: () => ({ ...invoice, id: undefined })
        }))
      };

      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockSnapshot)
      };

      db.collection.mockReturnValue(mockQuery);

      // Mock user service
      userService.getUserById.mockImplementation((userId) => {
        if (userId === 'user1') {
          return Promise.resolve({
            uid: 'user1',
            profiles: [{ id: 'profile1', name: 'Business' }],
            invoiceSettings: { timezone: 'America/New_York' }
          });
        } else if (userId === 'user2') {
          return Promise.resolve({
            uid: 'user2',
            invoiceSettings: { timezone: 'America/Los_Angeles' }
          });
        }
        return Promise.resolve(null);
      });

      // Mock customer service - CRITICAL: Must match exact profileId
      customerService.getCustomerById.mockImplementation((customerId, userId, profileId) => {
        if (customerId === 'cust1' && userId === 'user1' && profileId === 'profile1') {
          return Promise.resolve({
            id: 'cust1',
            name: 'Test Customer 1',
            email: 'customer1@test.com'
          });
        } else if (customerId === 'cust2' && userId === 'user2' && profileId === null) {
          return Promise.resolve({
            id: 'cust2',
            name: 'Test Customer 2',
            email: 'customer2@test.com'
          });
        }
        return Promise.resolve(null);
      });

      // Mock invoice service
      invoiceService.createInvoice.mockResolvedValue({
        id: 'new-invoice',
        invoiceNumber: 1001
      });

      // Mock recurring invoice service
      recurringInvoiceService.calculateNextGenerationDate.mockReturnValue(
        new Date(todayTimestamp + 86400000) // Tomorrow
      );
      recurringInvoiceService.processLineItemsWithTemplates.mockImplementation((items) => items);
      recurringInvoiceService.updateAfterGeneration.mockResolvedValue();

      // Execute the test
      const results = await recurringInvoiceController.processScheduledGeneration();

      // Verify results
      expect(results.successful).toBe(2);
      expect(results.failed).toBe(0);
      expect(results.errors).toHaveLength(0);

      // Verify Firestore query
      expect(db.collection).toHaveBeenCalledWith('recurringInvoices');
      expect(mockQuery.where).toHaveBeenCalledWith('isActive', '==', true);
      expect(mockQuery.where).toHaveBeenCalledWith('nextGenerationDate', '<=', todayTimestamp);

      // Verify profileId was correctly passed to customer service
      expect(customerService.getCustomerById).toHaveBeenCalledTimes(2);
      expect(customerService.getCustomerById).toHaveBeenCalledWith('cust1', 'user1', 'profile1');
      expect(customerService.getCustomerById).toHaveBeenCalledWith('cust2', 'user2', null);

      // Verify invoice creation
      expect(invoiceService.createInvoice).toHaveBeenCalledTimes(2);
      
      // Verify profileId was passed to invoice creation
      const invoiceCall1 = invoiceService.createInvoice.mock.calls[0];
      const invoiceCall2 = invoiceService.createInvoice.mock.calls[1];
      
      expect(invoiceCall1[4]).toBe('profile1'); // profileId for business profile
      expect(invoiceCall2[4]).toBe(null); // null for personal account
    });

    it('should skip paused and ended recurring invoices', async () => {
      const mockToday = new Date();
      mockToday.setHours(0, 0, 0, 0);
      const todayTimestamp = mockToday.getTime();

      const mockRecurringInvoices = [
        {
          id: 'rec-paused',
          userId: 'user1',
          profileId: 'profile1',
          customerId: 'cust1',
          customerName: 'Paused Customer',
          isActive: true,
          pausedUntil: todayTimestamp + 86400000, // Paused until tomorrow
          nextGenerationDate: todayTimestamp - 86400000
        },
        {
          id: 'rec-ended',
          userId: 'user2',
          profileId: 'profile2',
          customerId: 'cust2',
          customerName: 'Ended Customer',
          isActive: true,
          endDate: todayTimestamp - 86400000, // Ended yesterday
          nextGenerationDate: todayTimestamp - 86400000
        }
      ];

      const mockSnapshot = {
        size: mockRecurringInvoices.length,
        docs: mockRecurringInvoices.map(invoice => ({
          id: invoice.id,
          data: () => ({ ...invoice, id: undefined })
        }))
      };

      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockSnapshot)
      };

      db.collection.mockReturnValue(mockQuery);

      const results = await recurringInvoiceController.processScheduledGeneration();

      expect(results.successful).toBe(0);
      expect(results.failed).toBe(0);
      expect(invoiceService.createInvoice).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const mockToday = new Date();
      mockToday.setHours(0, 0, 0, 0);
      const todayTimestamp = mockToday.getTime();

      const mockRecurringInvoices = [
        {
          id: 'rec-fail',
          userId: 'user-not-found',
          profileId: 'profile1',
          customerId: 'cust1',
          customerName: 'Failing Customer',
          isActive: true,
          nextGenerationDate: todayTimestamp - 86400000,
          lineItems: [{ description: 'Service', amount: 100, quantity: 1 }]
        }
      ];

      const mockSnapshot = {
        size: mockRecurringInvoices.length,
        docs: mockRecurringInvoices.map(invoice => ({
          id: invoice.id,
          data: () => ({ ...invoice, id: undefined })
        }))
      };

      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockSnapshot)
      };

      db.collection.mockReturnValue(mockQuery);
      userService.getUserById.mockResolvedValue(null); // User not found

      const results = await recurringInvoiceController.processScheduledGeneration();

      expect(results.successful).toBe(0);
      expect(results.failed).toBe(1);
      expect(results.errors).toHaveLength(1);
      expect(results.errors[0].error).toContain('User account not found');
    });
  });
});
