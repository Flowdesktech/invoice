import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Fade,
  Grow,
} from '@mui/material';
import Footer from '../components/Footer';
import {
  Speed as SpeedIcon,
  AttachMoney as MoneyIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  PictureAsPdf as PdfIcon,
  Security as SecurityIcon,
  CloudUpload as CloudIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  Autorenew as AutorenewIcon,
  DevicesOther as DevicesIcon,
  Palette as PaletteIcon,
  Calculate as CalculateIcon,
  Loop as LoopIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const Features = () => {
  const coreFeatures = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast Invoice Creation',
      description: 'Create professional invoices in under 30 seconds with our intuitive interface',
      highlights: ['Auto-save drafts', 'Smart templates', 'Keyboard shortcuts'],
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40 }} />,
      title: 'Multi-Currency Support',
      description: 'Invoice in 30+ currencies with automatic formatting and real-time conversion rates',
      highlights: ['30+ currencies', 'Auto-formatting', 'Currency symbols'],
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Direct Email Delivery',
      description: 'Send invoices directly to clients with customized messages and delivery tracking',
      highlights: ['SendGrid integration', 'Custom messages', 'Delivery tracking'],
    },
    {
      icon: <PdfIcon sx={{ fontSize: 40 }} />,
      title: 'Professional PDF Export',
      description: 'Generate beautiful, branded PDFs that look professional on any device',
      highlights: ['Custom branding', 'High quality', 'Instant download'],
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Customer Management',
      description: 'Comprehensive customer database with all information in one place',
      highlights: ['Contact details', 'Invoice history', 'Payment tracking'],
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      title: 'Recurring Invoices',
      description: 'Automate billing for regular clients with flexible recurrence options',
      highlights: ['Multiple frequencies', 'Auto-generation', 'Edit templates'],
    },
  ];

  const advancedFeatures = [
    {
      icon: <BusinessIcon />,
      title: 'Business Profiles',
      description: 'Manage multiple businesses under one account with instant switching',
    },
    {
      icon: <AssessmentIcon />,
      title: 'Real-time Analytics',
      description: 'Track revenue, pending payments, and business metrics at a glance',
    },
    {
      icon: <AutorenewIcon />,
      title: 'Automatic Numbering',
      description: 'Smart invoice numbering with customizable prefixes and sequences',
    },
    {
      icon: <CalculateIcon />,
      title: 'Tax Management',
      description: 'Handle multiple tax rates with automatic calculations',
    },
    {
      icon: <CloudIcon />,
      title: 'Cloud Storage',
      description: 'All data securely stored in the cloud with automatic backups',
    },
    {
      icon: <DevicesIcon />,
      title: 'Mobile Responsive',
      description: 'Access your invoices from any device, anywhere, anytime',
    },
    {
      icon: <SecurityIcon />,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade security with Firebase authentication',
    },
    {
      icon: <LoopIcon />,
      title: 'Payment Tracking',
      description: 'Track invoice status from draft to paid with automated reminders',
    },
    {
      icon: <SearchIcon />,
      title: 'Smart Search',
      description: 'Find any invoice or customer instantly with powerful search',
    },
    {
      icon: <PaletteIcon />,
      title: 'Customizable Templates',
      description: 'Professional invoice templates that match your brand',
    },
  ];

  const comparisonData = [
    { feature: 'Invoice Creation', flowdesk: true, others: true },
    { feature: 'Multi-Currency Support', flowdesk: true, others: 'Limited' },
    { feature: 'Email Delivery', flowdesk: true, others: 'Paid' },
    { feature: 'PDF Export', flowdesk: true, others: true },
    { feature: 'Customer Management', flowdesk: true, others: true },
    { feature: 'Recurring Invoices', flowdesk: true, others: 'Paid' },
    { feature: 'Business Profiles', flowdesk: true, others: false },
    { feature: 'Real-time Analytics', flowdesk: true, others: 'Basic' },
    { feature: 'API Access', flowdesk: true, others: 'Paid' },
    { feature: 'Free Forever Plan', flowdesk: true, others: false },
  ];

  return (
    <>
      {/* React 19 Metadata */}
      <title>Features - FlowDesk Invoice Management | All Features & Capabilities</title>
      <meta name="description" content="Explore all features of FlowDesk invoice management system. Multi-currency support, PDF export, email delivery, recurring invoices, and more. Free forever for small businesses." />
      <meta name="keywords" content="invoice features, invoice management features, billing software features, invoice generator capabilities" />
      <link rel="canonical" href="https://flowdesk.tech/features" />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          color: '#1e293b',
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 10 },
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
                Powerful Features for Modern Businesses
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 4,
                  color: '#64748b',
                  fontWeight: 400,
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                Everything you need to manage invoices professionally, from creation to payment.
                All features included in our free forever plan.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    bgcolor: '#1e293b',
                    color: 'white',
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#0f172a',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Get Started Free
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Core Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Core Features
          </Typography>
          <Typography
            align="center"
            sx={{ mb: 8, color: '#64748b', fontSize: '1.1rem' }}
          >
            Essential tools for efficient invoice management
          </Typography>
          <Grid container spacing={4}>
            {coreFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Grow in timeout={800 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'none',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#cbd5e1',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" alignItems="flex-start" gap={3}>
                        <Box
                          sx={{
                            color: '#3b82f6',
                            p: 2,
                            bgcolor: '#eff6ff',
                            borderRadius: 2,
                            display: 'inline-block',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                            {feature.title}
                          </Typography>
                          <Typography sx={{ color: '#64748b', mb: 2 }}>
                            {feature.description}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {feature.highlights.map((highlight, idx) => (
                              <Chip
                                key={idx}
                                label={highlight}
                                size="small"
                                sx={{
                                  bgcolor: '#f1f5f9',
                                  color: '#475569',
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Advanced Features Grid */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fafbfc' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Advanced Capabilities
          </Typography>
          <Typography
            align="center"
            sx={{ mb: 8, color: '#64748b', fontSize: '1.1rem' }}
          >
            Powerful features that set FlowDesk apart
          </Typography>
          <Grid container spacing={3}>
            {advancedFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={1000 + index * 50}>
                  <Box
                    sx={{
                      bgcolor: 'white',
                      p: 3,
                      borderRadius: 2,
                      height: '100%',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#cbd5e1',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <Box sx={{ color: '#3b82f6', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Comparison Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FlowDesk vs Others
          </Typography>
          <Typography
            align="center"
            sx={{ mb: 6, color: '#64748b', fontSize: '1.1rem' }}
          >
            See why businesses choose FlowDesk
          </Typography>
          <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#1e293b', fontWeight: 700 }}>
                      Feature
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#1e293b', fontWeight: 700 }}>
                      FlowDesk
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', color: '#475569' }}>{row.feature}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {row.flowdesk === true ? (
                          <CheckIcon sx={{ color: '#10b981' }} />
                        ) : (
                          row.flowdesk
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                        {row.others === true ? (
                          <CheckIcon sx={{ color: '#94a3b8' }} />
                        ) : row.others === false ? (
                          '✗'
                        ) : (
                          row.others
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#1e293b', color: 'white' }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                mb: 2,
              }}
            >
              Ready to Experience All Features?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Join thousands of businesses using FlowDesk to streamline their invoicing
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/register"
                sx={{
                  bgcolor: 'white',
                  color: '#1e293b',
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Start Free Forever
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                Back to Home
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Features;
