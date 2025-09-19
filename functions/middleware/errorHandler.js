const { logger } = require('firebase-functions/v2');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log detailed error information for production monitoring
  const errorDetails = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    userId: req.user?.uid || 'Not authenticated',
    profileId: req.profileId || null,
    errorName: err.name,
    errorMessage: err.message,
    errorCode: err.code,
    stack: err.stack,
    body: req.body
  };
  
  // Log error with appropriate severity
  if (err.statusCode >= 500 || !err.statusCode) {
    logger.error('Internal Server Error', errorDetails);
  } else {
    logger.warn('Request Error', errorDetails);
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (err.code === 'auth/id-token-expired') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Your session has expired. Please login again.'
    });
  }

  // Firestore errors
  if (err.code === 5) { // NOT_FOUND
    return res.status(404).json({
      error: 'Not Found',
      message: err.message || 'Resource not found'
    });
  }

  if (err.code === 7) { // PERMISSION_DENIED
    return res.status(403).json({
      error: 'Forbidden',
      message: 'You do not have permission to perform this action'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Error',
    message: message, // Always send the actual error message
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async error wrapper for route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};
