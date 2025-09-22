// Load environment variables from .env file
require('dotenv').config();

const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { setGlobalOptions } = require('firebase-functions/v2');
const express = require('express');
// Import routes
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const userRoutes = require('./routes/userRoutes');
const recurringInvoiceRoutes = require('./routes/recurringInvoiceRoutes');
const contactRoutes = require('./routes/contactRoutes');
const flowBoostRoutes = require('./routes/flowBoostRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { corsMiddleware, corsOptions } = require('./middleware/cors');

// Import controller for scheduled functions
const recurringInvoiceController = require('./controllers/recurringInvoiceController');

// Set global options for all functions
setGlobalOptions({
  region: 'us-central1',
  // Increase memory for PDF generation with Puppeteer
  memory: '2GiB',
  timeoutSeconds: 300,
  maxInstances: 10
});

// Initialize Express app
const app = express();

// Enable CORS with configuration from middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().valueOf(),
    version: '2.0.0'
  });
});

// Handle preflight requests explicitly
app.options('*', corsMiddleware);

// API Routes
app.use('/customers', customerRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/users', userRoutes); // Profile and stats routes
app.use('/recurring-invoices', recurringInvoiceRoutes);
app.use('/contact', contactRoutes);
app.use('/flowboost', flowBoostRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.originalUrl
  });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Export the Express app as a Firebase Function v2
exports.api = onRequest({
  cors: false, // We handle CORS in Express
  region: 'us-central1',
  memory: '2GiB',
  timeoutSeconds: 300,
  maxInstances: 10,
  minInstances: 0
}, app);

// Scheduled function to automatically generate recurring invoices
// Runs every day at 2:00 AM (server time)
exports.generateRecurringInvoices = onSchedule({
  schedule: 'every day 02:00',
  timeZone: 'America/New_York', // Eastern Time
  region: 'us-central1',
  memory: '1GiB',
  timeoutSeconds: 540, // 9 minutes
  maxInstances: 1, // Prevent concurrent runs
}, async (event) => {
  // Delegate to controller method for better organization and testability
  return await recurringInvoiceController.processScheduledGeneration();
});
