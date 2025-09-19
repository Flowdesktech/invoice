/**
 * Test data management for E2E tests
 */

// Test secrets - hardcoded for browser environment
// In production, these should be in environment variables
const testSecrets = {
  testAccount: {
    email: 'test@invoicemanagement.com',
    password: 'Test123!@#',
    displayName: 'Test User'
  }
};

// Generate unique test email
const generateTestEmail = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `test.user.${timestamp}.${random}@flowdesk.test`;
};

// Generate unique test data
const generateTestUser = () => {
  const timestamp = Date.now();
  return {
    email: generateTestEmail(),
    password: 'Test123!@#',
    displayName: `Test User ${timestamp}`,
    company: `Test Company ${timestamp}`,
    phone: '+1234567890',
  };
};

// Common test accounts (for existing user tests)
const testAccounts = {
  validUser: testSecrets.testAccount,
  invalidUser: {
    email: 'invalid@flowdesk.com',
    password: 'wrongpassword',
  },
};

// Test invoice data
const testInvoice = {
  customer: {
    name: 'Test Customer',
    email: 'customer@test.com',
    phone: '+1234567890',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    }
  },
  lineItems: [
    {
      description: 'Test Service 1',
      quantity: 1,
      rate: 100
    },
    {
      description: 'Test Service 2',
      quantity: 2,
      rate: 50
    }
  ],
  notes: 'This is a test invoice',
  paymentTerms: 'Net 30',
  taxRate: 10
};

// Wait times for various operations
const WAIT_TIMES = {
  SHORT: 500,
  MEDIUM: 1000,
  LONG: 2000,
  NAVIGATION: 3000,
  API_CALL: 5000,
};

export {
  generateTestEmail,
  generateTestUser,
  testAccounts,
  testInvoice,
  WAIT_TIMES,
};
