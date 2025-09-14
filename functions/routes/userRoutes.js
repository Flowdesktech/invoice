const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { userValidators } = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * User/Profile routes
 * All routes are protected by authentication middleware
 */

// Get current user profile
router.get(
  '/profile',
  authenticate,
  userController.getUserProfile
);

// Update user profile
router.put(
  '/profile',
  authenticate,
  userValidators.updateProfile,
  handleValidationErrors,
  userController.updateUserProfile
);

// Get user statistics
router.get(
  '/stats',
  authenticate,
  userController.getUserStats
);

module.exports = router;
