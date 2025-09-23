const admin = require('firebase-admin');
const db = admin.firestore();

// Join waitlist
exports.joinWaitlist = async (req, res) => {
  try {
    const { name, email, businessType, expectedUsage } = req.body;
    
    // Basic validation
    if (!name || !email || !businessType) {
      return res.status(400).json({ 
        error: 'Name, email, and business type are required' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address' 
      });
    }
    
    // Check if email already exists in waitlist
    const waitlistRef = db.collection('flowboost_waitlist');
    const existingDoc = await waitlistRef.where('email', '==', email.toLowerCase()).get();
    
    if (!existingDoc.empty) {
      return res.status(400).json({ 
        error: 'Email already registered for waitlist' 
      });
    }
    
    // Add to waitlist
    const waitlistData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      businessType: businessType.trim(),
      expectedUsage: expectedUsage?.trim() || '',
      signupDate: admin.firestore.FieldValue.serverTimestamp(),
      source: req.headers.referer || 'direct',
      notified: false,
    };
    
    await waitlistRef.add(waitlistData);
    
    // TODO: Send welcome email using Mailgun
    // This would be implemented when email service is configured
    
    res.json({
      success: true,
      message: 'Successfully joined FlowBoost waitlist',
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ error: 'Failed to join waitlist' });
  }
};
