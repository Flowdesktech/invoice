const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contact - Submit contact form
router.post('/', contactController.submitContact);

module.exports = router;
