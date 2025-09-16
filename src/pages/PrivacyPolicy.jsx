import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* React 19 SEO Meta Tags */}
      <title>Privacy Policy - FlowDesk Invoice Management Software</title>
      <meta name="description" content="FlowDesk privacy policy. Learn how we protect your data, what information we collect, and your privacy rights. We take your privacy seriously." />
      <meta name="keywords" content="privacy policy, data protection, GDPR compliance, invoice software privacy, data security, user privacy rights" />
      <link rel="canonical" href="https://flowdesk.tech/privacy" />
      <meta name="robots" content="index, follow" />
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, pb: 30 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to App
        </Button>
      
      <Paper sx={{ p: { xs: 3, sm: 6 } }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Privacy Policy
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last updated: September 16, 2025
        </Typography>
        
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ '& > *': { mb: 3 } }}>
          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              1. Introduction
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to FlowDesk ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoice management service.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              2. Information We Collect
            </Typography>
            <Typography variant="body1" paragraph>
              We collect information you provide directly to us, such as:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1">Account information (name, email address)</Typography>
              <Typography component="li" variant="body1">Authentication data (managed securely by Firebase/Google)</Typography>
              <Typography component="li" variant="body1">Business information (company name, address, phone)</Typography>
              <Typography component="li" variant="body1">Invoice data (customer information, invoice details)</Typography>
              <Typography component="li" variant="body1">Payment information (processed securely by third-party providers)</Typography>
            </Box>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              3. How We Use Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We use your information to:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1">Provide, maintain, and improve our services</Typography>
              <Typography component="li" variant="body1">Process transactions and send related information</Typography>
              <Typography component="li" variant="body1">Send you technical notices and support messages</Typography>
              <Typography component="li" variant="body1">Communicate about products, services, and events</Typography>
              <Typography component="li" variant="body1">Monitor and analyze usage and trends</Typography>
            </Box>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              4. Authentication & Security
            </Typography>
            <Typography variant="body1" paragraph>
              We use Firebase Authentication powered by Google to manage user authentication. This means:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body1">We never store your password</Typography>
              <Typography component="li" variant="body1">Authentication is handled by Google's secure infrastructure</Typography>
              <Typography component="li" variant="body1">You can use Google Sign-In for convenient access</Typography>
              <Typography component="li" variant="body1">Multi-factor authentication is available through Google</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Additionally, we implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your business data is encrypted in transit and at rest using industry-standard encryption protocols.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              5. Data Sharing
            </Typography>
            <Typography variant="body1" paragraph>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1">With your consent</Typography>
              <Typography component="li" variant="body1">To comply with legal obligations</Typography>
              <Typography component="li" variant="body1">To protect our rights and safety</Typography>
              <Typography component="li" variant="body1">With service providers who assist in our operations</Typography>
            </Box>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              6. Your Rights
            </Typography>
            <Typography variant="body1" paragraph>
              You have the right to:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1">Access your personal information</Typography>
              <Typography component="li" variant="body1">Update or correct your information</Typography>
              <Typography component="li" variant="body1">Delete your account and associated data</Typography>
              <Typography component="li" variant="body1">Export your data</Typography>
              <Typography component="li" variant="body1">Opt-out of marketing communications</Typography>
            </Box>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              7. Cookies and Tracking
            </Typography>
            <Typography variant="body1" paragraph>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              8. Children's Privacy
            </Typography>
            <Typography variant="body1" paragraph>
              Our service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              9. Changes to This Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              10. Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy, please contact us at:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1">FlowDesk</Typography>
              <Typography variant="body1">Email: privacy@flowdesk.tech</Typography>
              <Typography variant="body1">Website: flowdesk.tech</Typography>
            </Box>
          </section>
        </Box>
      </Paper>
    </Container>
    
    <Footer />
    </>
  );
};

export default PrivacyPolicy;
