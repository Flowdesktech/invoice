// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => {
  const mockFirestore = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      where: jest.fn(() => ({
        get: jest.fn(),
        orderBy: jest.fn(() => ({
          get: jest.fn()
        }))
      })),
      add: jest.fn()
    })),
    FieldValue: {
      serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
      arrayUnion: jest.fn((value) => `ARRAY_UNION(${value})`),
      increment: jest.fn((value) => `INCREMENT(${value})`)
    }
  };

  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => mockFirestore),
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn()
    })),
    storage: jest.fn(() => ({
      bucket: jest.fn()
    }))
  };
});

// Mock Firebase Functions
jest.mock('firebase-functions/v2', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  },
  https: {
    onRequest: jest.fn()
  },
  scheduler: {
    onSchedule: jest.fn()
  }
}));

// Mock config/firebase
jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(),
      where: jest.fn(),
      add: jest.fn()
    }))
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

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Suppress console logs during tests unless debugging
if (process.env.DEBUG !== 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}

// Add custom matchers if needed
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false
      };
    }
  }
});
