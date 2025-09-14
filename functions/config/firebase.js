const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
try {
  console.log('Initializing Firebase Admin SDK...');
  console.log('Environment variables:', {
    FUNCTIONS_EMULATOR: process.env.FUNCTIONS_EMULATOR,
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
    NODE_ENV: process.env.NODE_ENV
  });
  
  // Extract storage bucket from FIREBASE_CONFIG if available
  let storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!storageBucket && process.env.FIREBASE_CONFIG) {
    try {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
      storageBucket = firebaseConfig.storageBucket;
      console.log('Storage bucket from FIREBASE_CONFIG:', storageBucket);
    } catch (e) {
      console.error('Failed to parse FIREBASE_CONFIG:', e);
    }
  }
  
  // First, try to load service account from file (prioritize local development)
  const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  console.log('Looking for service account at:', serviceAccountPath);
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log('Service account file found, loading credentials...');
    const serviceAccount = require(serviceAccountPath);
    console.log('Service account project ID:', serviceAccount.project_id);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket || `${serviceAccount.project_id}.appspot.com`
    });
    console.log('Firebase initialized with service account credentials');
    console.log('Using storage bucket:', storageBucket || `${serviceAccount.project_id}.appspot.com`);
  } else if (process.env.FUNCTIONS_EMULATOR || process.env.FIREBASE_CONFIG) {
    // Running in Firebase environment without local service account
    console.log('No local service account found, but detected Firebase environment');
    console.log('Using default credentials (this may not work for signed URLs in emulator)');
    admin.initializeApp();
  } else {
    // No credentials available
    console.warn('No service account found at:', serviceAccountPath);
    console.warn('Not in Firebase environment either.');
    console.warn('Some features like signed URLs will not work.');
    admin.initializeApp();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
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
