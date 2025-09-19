const { auth } = require('../config/firebase');
const { logger } = require('firebase-functions/v2');

/**
 * Authentication middleware to verify Firebase ID tokens
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No valid authentication token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      // Verify the ID token
      const decodedToken = await auth.verifyIdToken(token);
      
      // Attach user info to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        token: decodedToken
      };
      
      // Extract profileId from header (null means personal account)
      req.profileId = req.headers['x-profile-id'] || null;
      
      next();
    } catch (tokenError) {
      // Log token verification errors (usually client errors)
      logger.warn('Token verification failed', {
        error: tokenError.message,
        code: tokenError.code
      });
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid authentication token' 
      });
    }
  } catch (error) {
    // Log auth middleware errors (server errors)
    logger.error('Authentication middleware error', {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method
    });
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Authentication failed' 
    });
  }
};

module.exports = {
  authenticate
};
