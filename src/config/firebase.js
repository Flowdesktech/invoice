import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCZpM72HmM0hDsK0Y-wEjnj6HU-xsNdxM4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "invoicemanagement-35961.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "invoicemanagement-35961",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "invoicemanagement-35961.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "908612531900",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:908612531900:web:9e59b612777d28e0e402b9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BRERZ624DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
