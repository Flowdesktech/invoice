const { onRequest } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const express = require('express');
const cors = require('cors');

// Import routes
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const userRoutes = require('./routes/userRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

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

// Enable CORS with flexible configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins (any port)
    const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
    
    // Allow all Firebase hosting URLs (any subdomain of web.app or firebaseapp.com)
    const firebaseHostingPattern = /^https:\/\/[a-zA-Z0-9-]+\.(web\.app|firebaseapp\.com)$/;
    
    // List of additional allowed origins
    const allowedOrigins = [];
    
    // Allow custom domains if specified in environment
    if (process.env.ALLOWED_DOMAINS) {
      const customDomains = process.env.ALLOWED_DOMAINS.split(',').map(domain => domain.trim());
      allowedOrigins.push(...customDomains);
    }
    
    // Check if origin is allowed
    if (localhostPattern.test(origin) ||
        firebaseHostingPattern.test(origin) || 
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Profile-Id'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// API Routes
app.use('/customers', customerRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/users', userRoutes); // Profile and stats routes

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
