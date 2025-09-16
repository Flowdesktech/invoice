const cors = require('cors');

/**
 * CORS Configuration Middleware
 * 
 * Allows requests from:
 * - All localhost origins (development)
 * - All Firebase hosting URLs (*.web.app, *.firebaseapp.com)
 * - All subdomains of coremaven.tech (*.coremaven.tech)
 * - Custom domains specified in ALLOWED_DOMAINS environment variable
 */

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests, or Postman)
    if (!origin) return callback(null, true);
    
    // Pattern to match all localhost origins (any port)
    const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
    
    // Pattern to match all Firebase hosting URLs
    const firebaseHostingPattern = /^https:\/\/[a-zA-Z0-9-]+\.(web\.app|firebaseapp\.com)$/;
    
    // Pattern to match all subdomains of coremaven.tech (including the root domain)
    const coremavenPattern = /^https:\/\/([a-zA-Z0-9-]+\.)?coremaven\.tech$/;
    
    // Pattern to match flowdesk.tech and its subdomains
    const flowdeskPattern = /^https:\/\/([a-zA-Z0-9-]+\.)?flowdesk\.tech$/;
    
    // List of additional allowed origins
    const allowedOrigins = [];
    
    // Add custom domains from environment variable
    if (process.env.ALLOWED_DOMAINS) {
      const customDomains = process.env.ALLOWED_DOMAINS.split(',').map(domain => domain.trim());
      allowedOrigins.push(...customDomains);
    }
    
    // Log the origin for debugging (can be removed in production)
    console.log('CORS request from origin:', origin);
    
    // Check if origin is allowed
    if (localhostPattern.test(origin) ||
        firebaseHostingPattern.test(origin) ||
        coremavenPattern.test(origin) ||
        flowdeskPattern.test(origin) ||
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
  maxAge: 86400, // 24 hours - browsers can cache preflight response
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Create the CORS middleware instance
const corsMiddleware = cors(corsOptions);

// Export both the middleware and options (in case they're needed elsewhere)
module.exports = {
  corsMiddleware,
  corsOptions
};
