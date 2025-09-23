const express = require('express');
const router = express.Router();
const flowBoostController = require('../controllers/flowBoostController');

// Join waitlist - no authentication required
router.post('/waitlist', flowBoostController.joinWaitlist);

module.exports = router;
