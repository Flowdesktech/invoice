const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const flowBoostController = require('../controllers/flowBoostController');

// Get available tasks - requires authentication
router.get('/tasks', authenticateUser, flowBoostController.getAvailableTasks);

// Get user earnings - requires authentication
router.get('/earnings', authenticateUser, flowBoostController.getUserEarnings);

// Get FlowScore - requires authentication
router.get('/score', authenticateUser, flowBoostController.getFlowScore);

// Start a task - requires authentication
router.post('/tasks/start', authenticateUser, flowBoostController.startTask);

// Complete a task - requires authentication
router.post('/tasks/complete', authenticateUser, flowBoostController.completeTask);

// Join waitlist - no authentication required
router.post('/waitlist', flowBoostController.joinWaitlist);

module.exports = router;
