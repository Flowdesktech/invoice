/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log detailed error information
  console.error('==================== ERROR ====================');
  console.error('Timestamp:', new Date().valueOf());
  console.error('Method:', req.method);
  console.error('Path:', req.path);
  console.error('Body:', JSON.stringify(req.body, null, 2));
  console.error('User ID:', req.user?.uid || 'Not authenticated');
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Error Code:', err.code);
  console.error('Stack Trace:', err.stack);
  console.error('==============================================');

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
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Error',
    message: statusCode === 500 ? 'Something went wrong' : message,
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
