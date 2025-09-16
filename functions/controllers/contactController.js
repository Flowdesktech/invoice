const { asyncHandler } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');

class ContactController {
  /**
   * Handle contact form submission
   */
  submitContact = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'All fields are required',
        message: 'Please fill in all fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        error: 'Message too short',
        message: 'Message must be at least 10 characters long'
      });
    }

    try {
      // Send contact email
      const emailResult = await emailService.sendContactEmail({
        name,
        email,
        subject,
        message
      });

      res.json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
        emailResult
      });
    } catch (error) {
      console.error('Error sending contact email:', error);
      res.status(500).json({
        error: 'Failed to send message',
        message: 'There was an error sending your message. Please try again later.'
      });
    }
  });
}

module.exports = new ContactController();
