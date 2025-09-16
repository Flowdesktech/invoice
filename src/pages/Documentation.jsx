import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DocumentIcon,
  AccountBalance as InvoiceIcon,
  People as CustomerIcon,
  Schedule as RecurringIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  ContactSupport as SupportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Documentation = () => {
  const navigate = useNavigate();

  const docSections = [
    {
      title: 'Getting Started',
      icon: <DocumentIcon fontSize="large" />,
      description: 'Learn the basics of FlowDesk and how to create your first invoice.',
      topics: ['Account Setup', 'Creating Your Profile', 'Dashboard Overview'],
    },
    {
      title: 'Managing Invoices',
      icon: <InvoiceIcon fontSize="large" />,
      description: 'Everything you need to know about creating and managing invoices.',
      topics: ['Creating Invoices', 'Invoice Templates', 'Sending Invoices', 'Payment Tracking'],
    },
    {
      title: 'Customer Management',
      icon: <CustomerIcon fontSize="large" />,
      description: 'Organize and manage your customer information effectively.',
      topics: ['Adding Customers', 'Customer Details', 'Contact History'],
    },
    {
      title: 'Recurring Invoices',
      icon: <RecurringIcon fontSize="large" />,
      description: 'Set up automated recurring invoices for regular clients.',
      topics: ['Creating Recurring Invoices', 'Managing Schedules', 'Automatic Generation'],
    },
    {
      title: 'Reports & Analytics',
      icon: <ReportsIcon fontSize="large" />,
      description: 'Gain insights into your business with powerful reporting tools.',
      topics: ['Dashboard Analytics', 'Revenue Reports', 'Export Options'],
    },
    {
      title: 'Account Settings',
      icon: <SettingsIcon fontSize="large" />,
      description: 'Customize FlowDesk to match your business needs.',
      topics: ['Profile Settings', 'Invoice Customization', 'Email Templates'],
    },
    {
      title: 'Security & Privacy',
      icon: <SecurityIcon fontSize="large" />,
      description: 'Learn about our security measures and data protection.',
      topics: ['Data Security', 'Backup & Recovery', 'Privacy Controls'],
    },
    {
      title: 'Support & FAQs',
      icon: <SupportIcon fontSize="large" />,
      description: 'Get help and find answers to common questions.',
      topics: ['FAQs', 'Contact Support', 'Troubleshooting'],
    },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pb: 30 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to App
        </Button>

      <Paper sx={{ p: { xs: 3, sm: 6 }, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Documentation
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Welcome to FlowDesk Documentation. Find everything you need to make the most of our invoice management platform.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {docSections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ color: 'primary.main', mr: 2 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" component="h2">
                    {section.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {section.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {section.topics.map((topic) => (
                    <Typography
                      key={topic}
                      component="li"
                      variant="body2"
                      sx={{ mb: 0.5 }}
                    >
                      {topic}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Guide
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, mt: 6, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: '600' }} color="white">
          Need More Help?
        </Typography>
        <Typography variant="body1" paragraph color="white">
          Can't find what you're looking for? Our support team is here to help.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/contact')}
            sx={{ mr: 2 }}
          >
            Contact Support
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => window.open('mailto:support@flowdesk.tech')}
          >
            Email Us
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Documentation Version 1.0 • Last Updated: September 2025
        </Typography>
      </Box>
    </Container>
    
    <Footer />
    </>
  );
};

export default Documentation;
