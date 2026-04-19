import axios from 'axios';

// Same-origin base URL for public API calls. next.config.mjs rewrites
// /api/:path* to the Firebase Cloud Functions host, so no CORS is needed
// and we avoid leaking the project ID into the browser bundle.
const API_BASE_URL = '/api';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicInvoiceAPI = {
  preview: (data) => publicApi.post('/public/invoices/preview', data),
  generatePdf: (data) => publicApi.post('/public/invoices/generate-pdf', data),
};

export default publicApi;
