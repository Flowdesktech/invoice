const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const { logger } = require('firebase-functions/v2');

// Initialize Firebase Admin SDK
try {
  logger.info('Initializing Firebase Admin SDK', {
    FUNCTIONS_EMULATOR: process.env.FUNCTIONS_EMULATOR,
    NODE_ENV: process.env.NODE_ENV,
    hasFirebaseConfig: !!process.env.FIREBASE_CONFIG
  });
  
  // Extract storage bucket from FIREBASE_CONFIG if available
  let storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!storageBucket && process.env.FIREBASE_CONFIG) {
    try {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
      storageBucket = firebaseConfig.storageBucket;
      logger.info('Storage bucket from FIREBASE_CONFIG', { storageBucket });
    } catch (e) {
      logger.error('Failed to parse FIREBASE_CONFIG', { error: e.message });
    }
  }
  
  // First, try to load service account from file (prioritize local development)
  const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  logger.info('Looking for service account', { path: serviceAccountPath });
  
  if (fs.existsSync(serviceAccountPath)) {
    logger.info('Service account file found, loading credentials');
    const serviceAccount = require(serviceAccountPath);
    logger.info('Service account project ID', { projectId: serviceAccount.project_id });
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket || `${serviceAccount.project_id}.appspot.com`
    });
    logger.info('Firebase initialized with service account credentials', {
      storageBucket: storageBucket || `${serviceAccount.project_id}.appspot.com`
    });
  } else if (process.env.FUNCTIONS_EMULATOR || process.env.FIREBASE_CONFIG) {
    // Running in Firebase environment without local service account
    logger.info('No local service account found, but detected Firebase environment');
    logger.warn('Using default credentials (this may not work for signed URLs in emulator)');
    admin.initializeApp();
  } else {
    // No credentials available
    logger.warn('No service account found', { path: serviceAccountPath });
    logger.warn('Not in Firebase environment either');
    logger.warn('Some features like signed URLs will not work');
    admin.initializeApp();
  }
} catch (error) {
  logger.error('Error initializing Firebase Admin', {
    error: error.message,
    stack: error.stack
  });
  // Fallback initialization
  admin.initializeApp();
}

// Get service references
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  auth,
  storage
};
