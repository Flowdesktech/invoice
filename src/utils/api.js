import axios from 'axios';
import { auth } from '../config/firebase';

// Base URL for Firebase Functions
// In development, this will be the emulator URL
// In production, this will be your Firebase Functions URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'invoicemanagement-35961'}.cloudfunctions.net/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token and profileId to requests
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add profileId to all requests (only if not using personal account)
      const profileId = localStorage.getItem('flowdesk_active_profile');
      if (profileId && profileId !== 'null') {
        config.headers['X-Profile-Id'] = profileId;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Customer API endpoints
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Invoice API endpoints
export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  preview: (data) => api.post('/invoices/preview', data),
  updateStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }),
  delete: (id) => api.delete(`/invoices/${id}`),
  getStats: () => api.get('/invoices/stats'),
  generatePdf: (id) => api.get(`/invoices/${id}/pdf`),
  send: (id, data) => api.post(`/invoices/${id}/send`, data),
};

// User Profile API endpoints
export const profileAPI = {
  get: () => api.get('/users/profile'),
  update: (data) => api.put('/users/profile', data),
};

// User Stats API endpoint
export const statsAPI = {
  get: () => api.get('/users/stats'),
};

// Recurring Invoice API endpoints
export const recurringInvoiceAPI = {
  getAll: () => api.get('/recurring-invoices'),
  getById: (id) => api.get(`/recurring-invoices/${id}`),
  create: (data) => api.post('/recurring-invoices', data),
  update: (id, data) => api.put(`/recurring-invoices/${id}`, data),
  pause: (id, pauseUntil) => api.post(`/recurring-invoices/${id}/pause`, { pauseUntil }),
  resume: (id) => api.post(`/recurring-invoices/${id}/resume`),
  stop: (id) => api.delete(`/recurring-invoices/${id}`),
  generateNext: (id) => api.post(`/recurring-invoices/${id}/generate`),
  getGeneratedInvoices: (id) => api.get(`/recurring-invoices/${id}/invoices`),
};

// FlowBoost API endpoints
export const flowBoostAPI = {
  // Get available tasks
  getTasks: () => api.get('/flowboost/tasks'),
  // Get user earnings
  getEarnings: () => api.get('/flowboost/earnings'),
  // Get FlowScore
  getScore: () => api.get('/flowboost/score'),
  // Start a task
  startTask: (taskId) => api.post('/flowboost/tasks/start', { taskId }),
  // Complete a task
  completeTask: (taskId, completionData) => api.post('/flowboost/tasks/complete', { taskId, completionData }),
  // Join waitlist
  joinWaitlist: (data) => api.post('/flowboost/waitlist', data),
};

export default api;
