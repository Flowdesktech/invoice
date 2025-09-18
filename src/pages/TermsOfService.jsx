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
import Header from '../components/Header';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* React 19 SEO Meta Tags */}
      <title>Terms of Service - FlowDesk Invoice Management</title>
      <meta name="description" content="FlowDesk terms of service. Read our terms and conditions for using our free invoice management software. Clear, fair terms for all users." />
      <meta name="keywords" content="terms of service, terms and conditions, user agreement, invoice software terms, FlowDesk terms" />
      <link rel="canonical" href="https://flowdesk.tech/terms" />
      <meta name="robots" content="index, follow" />
      
      <Header />
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, pb: 30, pt: 10 }}>
      
      <Paper sx={{ p: { xs: 3, sm: 6 } }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Terms of Service
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Effective Date: September 16, 2025
        </Typography>
        
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ '& > *': { mb: 3 } }}>
          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              1. Agreement to Terms
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing or using FlowDesk's invoice management service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you do not have permission to access the Service.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              2. Use of Service
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>2.1 Eligibility:</strong> You must be at least 18 years old and capable of forming a binding contract to use our Service.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>2.2 Account Registration:</strong> You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>2.3 Acceptable Use:</strong> You agree not to use the Service for any unlawful purposes or in any way that could damage, disable, overburden, or impair the Service.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              3. Service Description
            </Typography>
            <Typography variant="body1" paragraph>
              FlowDesk provides an online invoice management platform that allows users to:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1">Create and manage invoices</Typography>
              <Typography component="li" variant="body1">Track customer information</Typography>
              <Typography component="li" variant="body1">Generate financial reports</Typography>
              <Typography component="li" variant="body1">Set up recurring invoices</Typography>
              <Typography component="li" variant="body1">Export data in various formats</Typography>
            </Box>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              4. User Content
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>4.1 Ownership:</strong> You retain all rights to the content you upload to the Service, including invoices, customer data, and business information.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>4.2 License:</strong> By using the Service, you grant us a limited license to process, store, and display your content solely for the purpose of providing the Service.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>4.3 Responsibility:</strong> You are solely responsible for the accuracy, legality, and appropriateness of all content you submit.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              5. Payment Terms
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>5.1 Subscription Fees:</strong> Certain features of the Service may require payment. All fees are non-refundable unless otherwise stated.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>5.2 Billing:</strong> Subscription fees are billed in advance on a monthly or annual basis and will automatically renew unless cancelled.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>5.3 Price Changes:</strong> We reserve the right to modify pricing with 30 days' notice.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              6. Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              The Service and its original content, features, and functionality are owned by FlowDesk and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              7. Privacy
            </Typography>
            <Typography variant="body1" paragraph>
              Your use of the Service is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              8. Disclaimers
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>8.1 Service Availability:</strong> The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>8.2 Professional Advice:</strong> The Service is not a substitute for professional accounting, legal, or financial advice.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              9. Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
              To the maximum extent permitted by law, FlowDesk shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              10. Indemnification
            </Typography>
            <Typography variant="body1" paragraph>
              You agree to defend, indemnify, and hold harmless FlowDesk and its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              11. Termination
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>11.1 By You:</strong> You may terminate your account at any time by contacting support or using account settings.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>11.2 By Us:</strong> We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>11.3 Effect:</strong> Upon termination, your right to use the Service will cease immediately. You may download your data for a period of 30 days after termination.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              12. Governing Law
            </Typography>
            <Typography variant="body1" paragraph>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              13. Changes to Terms
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or through the Service. Continued use after changes constitutes acceptance.
            </Typography>
          </section>

          <section>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
              14. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              For questions about these Terms, please contact us at:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1">FlowDesk</Typography>
              <Typography variant="body1">Email: legal@flowdesk.tech</Typography>
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

export default TermsOfService;
