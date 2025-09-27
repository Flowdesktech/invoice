import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Stack,
  Fade,
  IconButton,
} from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  ChatBubbleOutline as ChatIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import contactAPI from '../services/contactAPI';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Send contact form to backend
      await contactAPI.submit(formData);
      
      setLoading(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      setLoading(false);
      console.error('Error sending contact form:', error);
      
      // Handle specific error messages
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again later.';
      setErrors({ submit: errorMessage });
    }
  };

  return (
    <>
      {/* React 19 Metadata */}
      <title>Contact Us - FlowDesk Invoice Management | Get in Touch</title>
      <meta name="description" content="Contact FlowDesk for support, questions, or feedback. We're here to help you with your invoice management needs. Reach out at contact@flowdesk.tech." />
      <meta name="keywords" content="contact flowdesk, invoice support, flowdesk help, invoice management contact" />
      <link rel="canonical" href="https://flowdesk.tech/contact" />

      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          pt: { xs: 12, md: 16 },  // Increased padding to account for header
          pb: { xs: 6, md: 8 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box textAlign="center">
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Get in Touch
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 4,
                  color: '#64748b',
                  fontWeight: 400,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Contact Form Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: '#1e293b',
                    }}
                  >
                    Contact Information
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: '#eff6ff',
                          borderRadius: 2,
                          color: '#3b82f6',
                        }}
                      >
                        <EmailIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography 
                          component="a" 
                          href="mailto:contact@flowdesk.tech"
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#3b82f6',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            }
                          }}
                        >
                          contact@flowdesk.tech
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: '#eff6ff',
                          borderRadius: 2,
                          color: '#3b82f6',
                        }}
                      >
                        <TimeIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Response Time
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Within 24 hours
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: '#eff6ff',
                          borderRadius: 2,
                          color: '#3b82f6',
                        }}
                      >
                        <LocationIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Serving Globally
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                  
                  {/* AI Chat Coming Soon */}
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 4,
                      p: 3,
                      bgcolor: '#fafbfc',
                      borderColor: '#e2e8f0',
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <ChatIcon sx={{ color: '#3b82f6' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        AI Support Coming Soon
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      We're working on an AI-powered chat assistant to provide instant help with your invoicing questions.
                    </Typography>
                    <Chip
                      label="In Development"
                      size="small"
                      sx={{
                        mt: 2,
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                        fontWeight: 500,
                      }}
                    />
                  </Paper>
                </Box>
              </Fade>
            </Grid>
            
            {/* Contact Form */}
            <Grid item size={{ xs: 12, md: 8 }}>
              <Fade in timeout={1200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 5 },
                    bgcolor: '#fafbfc',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: '#1e293b',
                    }}
                  >
                    Send us a Message
                  </Typography>
                  
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        disabled={loading}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={loading}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        disabled={loading}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        disabled={loading}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                          }
                        }}
                      />
                      
                      {/* Error message display */}
                      {errors.submit && (
                        <Alert severity="error">
                          {errors.submit}
                        </Alert>
                      )}
                      
                      <Box>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                          sx={{
                            bgcolor: '#1e293b',
                            color: 'white',
                            py: 1.5,
                            px: 4,
                            '&:hover': {
                              bgcolor: '#0f172a',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                          * Required fields
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
                    By submitting this form, you agree to our terms of service and privacy policy.
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 4,
              color: '#1e293b',
            }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Stack spacing={3}>
            {[
              {
                question: 'How quickly will I receive a response?',
                answer: 'We typically respond to all inquiries within 24 hours during business days.'
              },
              {
                question: 'What kind of support do you provide?',
                answer: 'We provide technical support, onboarding assistance, and help with any features or billing questions.'
              },
              {
                question: 'Can I schedule a demo?',
                answer: 'Yes! Just mention in your message that you\'d like to schedule a demo and we\'ll set it up.'
              },
              {
                question: 'Do you offer phone support?',
                answer: 'Currently, we provide support via email. Phone support is coming soon for premium plans.'
              }
            ].map((faq, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                  {faq.question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Contact;
