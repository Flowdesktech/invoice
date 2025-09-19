const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * User controller handles HTTP requests for user profile operations
 */
class UserController {
  /**
   * Get current user profile
   */
  getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.uid;
    let user = await userService.getUserById(userId);
    
    // If user doesn't exist, initialize with default settings
    if (!user) {
      user = await userService.initializeUserSettings(
        userId,
        req.user.email,
        req.user.displayName || ''
      );
    }
    
    res.json(user);
  });

  /**
   * Update user profile
   */
  updateUserProfile = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.uid;
      const updateData = req.body;
      
      // Validate email if provided
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          const error = new Error('Invalid email address format');
          error.statusCode = 400;
          throw error;
        }
      }
      
      // Validate invoice settings if provided
      if (updateData.invoiceSettings) {
        if (updateData.invoiceSettings.nextNumber && updateData.invoiceSettings.nextNumber < 1) {
          const error = new Error('Invoice number must be greater than 0');
          error.statusCode = 400;
          throw error;
        }
        
        if (updateData.invoiceSettings.prefix && updateData.invoiceSettings.prefix.length > 10) {
          const error = new Error('Invoice prefix must be 10 characters or less');
          error.statusCode = 400;
          throw error;
        }
      }
      
      const updatedUser = await userService.updateUserProfile(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      throw error;
    }
  });

  /**
   * Get user statistics
   */
  getUserStats = asyncHandler(async (req, res) => {
    const stats = await userService.getUserStats(req.user.uid, req.profileId);
    res.json(stats);
  });
}

module.exports = new UserController();
