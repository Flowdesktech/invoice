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
import Header from '../components/Header';
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
  TrendingUp as TrendingUpIcon,
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
    {
      icon: <TrendingUpIcon />,
      title: 'FlowBoost (Coming Soon)',
      description: 'Turn business downtime into income with smart task matching. Earn $150-500/month!',
      isComingSoon: true,
    },
  ];

  const comparisonData = [
    { feature: '🚀 FlowBoost Earnings', flowdesk: 'Coming Soon!', others: '❌ Not Available', highlight: true },
    { feature: 'Earn While Invoicing', flowdesk: '$150-500/month', others: '❌ No Earning Feature', highlight: true },
    { feature: 'Professional Templates', flowdesk: '15 Templates', others: '3-5 Templates' },
    { feature: 'Setup Time', flowdesk: '< 2 minutes', others: '15+ minutes' },
    { feature: 'Multi-Currency Support', flowdesk: '✓ Built-in', others: 'Limited' },
    { feature: 'Email Delivery', flowdesk: '✓ Free', others: 'Paid Add-on' },
    { feature: 'PDF Export', flowdesk: '✓ Free', others: '✓ Free' },
    { feature: 'Customer Management', flowdesk: '✓ Unlimited', others: 'Limited' },
    { feature: 'Recurring Invoices', flowdesk: '✓ Free', others: 'Premium Only' },
    { feature: 'Mobile Access', flowdesk: '✓ Responsive', others: 'App Required' },
    { feature: 'Support', flowdesk: 'Email Support', others: 'Varies' },
    { feature: 'Price', flowdesk: 'Free Forever', others: '$15-50/month' },
  ];

  return (
    <>
      {/* React 19 Metadata */}
      <title>Features - FlowDesk Invoice Management | All Features & Capabilities</title>
      <meta name="description" content="Explore all features of FlowDesk invoice management system. Multi-currency support, PDF export, email delivery, recurring invoices, and more. Free forever for small businesses." />
      <meta name="keywords" content="invoice features, invoice management features, billing software features, invoice generator capabilities" />
      <link rel="canonical" href="https://flowdesk.tech/features" />

      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
          color: '#1e293b',
          pt: { xs: 12, md: 16 },  // Increased padding to account for header
          pb: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            opacity: 0.03,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e293b' stroke-width='1' opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box textAlign="center">
              <Typography
                variant="body2"
                sx={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  mb: 3,
                }}
              >
                ALL FEATURES INCLUDED
              </Typography>
              
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.1,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                }}
              >
                Everything You Need to
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Run Your Business
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  mb: 4,
                  color: '#475569',
                  fontWeight: 400,
                  lineHeight: 1.8,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Professional invoicing tools designed for freelancers, agencies, and small businesses. 
                Every feature you need, nothing you don't.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                background: '#f0f9ff',
                color: '#0369a1',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                mb: 3,
              }}
            >
              CORE FEATURES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 700,
                mb: 3,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Essential Tools for
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Invoice Management
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                color: '#64748b',
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              Everything you need to create, send, and track professional invoices
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {coreFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Grow in timeout={800 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      border: '1px solid #f1f5f9',
                      boxShadow: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: '#ffffff',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" alignItems="flex-start" gap={3}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '16px',
                            background: index % 2 === 0 
                              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: index % 2 === 0 
                              ? '0 8px 24px -4px rgba(59, 130, 246, 0.3)' 
                              : '0 8px 24px -4px rgba(139, 92, 246, 0.3)',
                          }}
                        >
                          {React.cloneElement(feature.icon, { 
                            sx: { 
                              fontSize: 28, 
                              color: 'white' 
                            } 
                          })}
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0f172a', fontSize: '1.25rem' }}>
                            {feature.title}
                          </Typography>
                          <Typography sx={{ color: '#64748b', mb: 3, lineHeight: 1.7 }}>
                            {feature.description}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {feature.highlights.map((highlight, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  color: '#10b981',
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                }}
                              >
                                <CheckIcon sx={{ fontSize: 16 }} />
                                {highlight}
                              </Box>
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
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#fafbfc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                background: '#f0f4ff',
                color: '#5b21b6',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                mb: 3,
              }}
            >
              ADVANCED CAPABILITIES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 700,
                mb: 3,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Features That
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Scale With You
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                color: '#64748b',
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              Professional tools designed to grow with your business
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {advancedFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={1000 + index * 50}>
                  <Box
                    sx={{
                      height: '100%',
                      p: 4,
                      bgcolor: 'white',
                      borderRadius: '16px',
                      border: '1px solid transparent',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb',
                      },
                    }}
                  >
                    {/* Coming Soon Badge */}
                    {feature.isComingSoon && (
                      <Chip
                        label="Coming Soon"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        background: 
                          index % 3 === 0 ? 'rgba(59, 130, 246, 0.1)' : 
                          index % 3 === 1 ? 'rgba(139, 92, 246, 0.1)' : 
                          'rgba(16, 185, 129, 0.1)',
                      }}
                    >
                      {React.cloneElement(feature.icon, { 
                        sx: { 
                          fontSize: 28,
                          color: 
                            index % 3 === 0 ? '#3b82f6' : 
                            index % 3 === 1 ? '#8b5cf6' : 
                            '#10b981'
                        } 
                      })}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0f172a', fontSize: '1.125rem' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
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
                    <tr 
                      key={index} 
                      style={{ 
                        borderTop: '1px solid #e2e8f0',
                        backgroundColor: row.highlight ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                      }}
                    >
                      <td style={{ 
                        padding: '16px', 
                        color: row.highlight ? '#1e40af' : '#475569',
                        fontWeight: row.highlight ? 600 : 400,
                      }}>
                        {row.feature}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'center',
                        color: row.highlight ? '#1e40af' : 'inherit',
                        fontWeight: row.highlight ? 600 : 400,
                      }}>
                        {row.flowdesk === true ? (
                          <CheckIcon sx={{ color: '#10b981' }} />
                        ) : (
                          row.flowdesk
                        )}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'center', 
                        color: row.highlight ? '#dc2626' : '#94a3b8',
                        fontWeight: row.highlight ? 600 : 400,
                      }}>
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
      <Box 
        sx={{ 
          py: { xs: 10, md: 16 }, 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: `
              radial-gradient(circle at 1px 1px, white 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: 'white',
                mb: 3,
                letterSpacing: '-0.03em',
              }}
            >
              Start Using All Features Today
            </Typography>
            <Typography
              variant="h5"
              sx={{ 
                mb: 6, 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400,
                fontSize: { xs: '1.125rem', md: '1.375rem' },
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Everything is 100% free. No hidden fees, no credit card required.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/register"
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  py: 2.5,
                  px: 6,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  py: 2.5,
                  px: 5,
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                  transition: 'all 0.3s',
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
