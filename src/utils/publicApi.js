import axios from 'axios';

// Base URL for Firebase Functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'invoicemanagement-35961'}.cloudfunctions.net/api`;

// Create axios instance for public (non-authenticated) requests
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public Invoice API endpoints (no auth required)
export const publicInvoiceAPI = {
  // Preview invoice without saving
  preview: (data) => publicApi.post('/public/invoices/preview', data),
  
  // Generate PDF without saving
  generatePdf: (data) => publicApi.post('/public/invoices/generate-pdf', data),
};

export default publicApi;
