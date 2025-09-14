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
    const userId = req.user.uid;
    const updateData = req.body;
    
    const updatedUser = await userService.updateUserProfile(userId, updateData);
    res.json(updatedUser);
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
