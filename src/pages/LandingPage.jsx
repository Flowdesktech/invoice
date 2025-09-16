import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
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
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast Invoice Generation',
      description: 'Create professional invoices in under 30 seconds. Our streamlined interface makes invoicing effortless.',
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40 }} />,
      title: 'Multi-Currency Support',
      description: 'Invoice in 30+ currencies with real-time conversion. Perfect for international businesses.',
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Direct Email Delivery',
      description: 'Send invoices directly to clients with one click. Track opens and get delivery confirmations.',
    },
    {
      icon: <PdfIcon sx={{ fontSize: 40 }} />,
      title: 'Professional PDF Export',
      description: 'Generate beautiful, branded PDF invoices that look professional on any device.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Customer Management',
      description: 'Keep all your client information organized in one place. Never lose track of important details.',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      title: 'Recurring Invoices',
      description: 'Set up automated recurring invoices for regular clients. Save hours every month.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Invoices Created', value: '500K+' },
    { label: 'Countries Served', value: '120+' },
    { label: 'Time Saved', value: '1M+ Hours' },
  ];

  return (
    <>
      {/* React 19 Metadata - Optimized for SEO */}
      <title>FlowDesk - Free Invoice Management Software for Small Business | Get Paid 3x Faster</title>
      <meta name="description" content="Create professional invoices in seconds. Free invoice software with automated reminders, payment tracking, and recurring billing. Join 10,000+ businesses getting paid faster. No credit card required." />
      <meta name="keywords" content="free invoice software, invoice generator online, small business invoicing, freelance billing software, payment tracking app, recurring invoices, invoice management system, get paid faster, invoice templates, billing automation" />
      <link rel="canonical" href="https://flowdesk.tech" />
      
      {/* Open Graph for Social Sharing */}
      <meta property="og:title" content="FlowDesk - Professional Invoice Management Made Simple" />
      <meta property="og:description" content="Stop chasing payments. Create, send, and track invoices with FlowDesk's free invoice management software. Get paid 3x faster." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://flowdesk.tech" />
      <meta property="og:image" content="https://flowdesk.tech/og-image.png" />
      <meta property="og:site_name" content="FlowDesk" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="FlowDesk - Get Paid Faster with Free Invoice Software" />
      <meta name="twitter:description" content="Professional invoicing made simple. Create, send, track invoices and get paid 3x faster. Free forever for small businesses." />
      <meta name="twitter:image" content="https://flowdesk.tech/twitter-card.png" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="FlowDesk" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#1e293b" />
      <meta name="application-name" content="FlowDesk Invoice Management" />
      
      {/* Structured Data for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "FlowDesk",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Professional invoice management software for freelancers and small businesses. Create, send, and track invoices to get paid faster.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "priceValidUntil": "2025-12-31"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Invoice Creation",
            "Payment Tracking",
            "Recurring Invoices",
            "Multi-Currency Support",
            "PDF Export",
            "Email Integration",
            "Customer Management",
            "Financial Reports"
          ]
        })}
      </script>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          color: '#1e293b',
          pt: { xs: 10, md: 14 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 800,
                      mb: 2,
                      lineHeight: 1.2,
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Invoice Management Made Simple
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      mb: 2,
                      color: '#64748b',
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    Create, send, and track professional invoices in seconds. 
                    100% free now with premium features coming soon.
                  </Typography>
                  <Chip 
                    label="🎯 Early Access: Get all features free + lock in future discounts!" 
                    color="success" 
                    sx={{ mb: 4, fontSize: '0.9rem', py: 2.5, px: 1 }}
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        bgcolor: '#1e293b',
                        color: 'white',
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: '0 4px 14px 0 rgba(30, 41, 59, 0.2)',
                        '&:hover': {
                          bgcolor: '#0f172a',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px 0 rgba(30, 41, 59, 0.3)',
                        },
                        transition: 'all 0.3s',
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Start Free Forever
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: '#cbd5e1',
                        color: '#475569',
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: '#94a3b8',
                          bgcolor: '#f8fafc',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      Sign In
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                    <Chip
                      icon={<CheckIcon sx={{ color: '#10b981' }} />}
                      label="No Credit Card Required"
                      sx={{ 
                        bgcolor: 'white',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      icon={<CheckIcon sx={{ color: '#10b981' }} />}
                      label="Free Forever"
                      sx={{ 
                        bgcolor: 'white',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        fontWeight: 500,
                      }}
                    />
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 300, md: 400 },
                    background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    p: 3,
                  }}
                >
                  {/* Mock Dashboard Preview */}
                  <Box sx={{ 
                    background: 'white',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                      Invoice Dashboard
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ bgcolor: '#e0f2fe', p: 1.5, borderRadius: 1 }}>
                          <Typography variant="caption" color="#64748b">Total Revenue</Typography>
                          <Typography variant="h6" color="#0284c7">$45,230</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ bgcolor: '#dcfce7', p: 1.5, borderRadius: 1 }}>
                          <Typography variant="caption" color="#64748b">Paid Invoices</Typography>
                          <Typography variant="h6" color="#16a34a">124</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ background: 'white', borderRadius: 2, p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>Recent Invoices</Typography>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #f1f5f9' }}>
                        <Typography variant="body2" color="#1e293b">INV-00{i}23</Typography>
                        <Chip size="small" label="Paid" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontSize: '0.75rem' }} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRight: index < 3 ? { xs: 0, md: '1px solid #e2e8f0' } : 0,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
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
            Everything You Need for Invoice Management
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 8, maxWidth: 800, mx: 'auto', color: '#64748b', fontWeight: 400 }}
          >
            FlowDesk provides all the tools you need to manage your business invoicing efficiently
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Fade in timeout={1000 + index * 100}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      bgcolor: 'white',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#cbd5e1',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        color: '#3b82f6',
                        mb: 2,
                        p: 2,
                        bgcolor: '#eff6ff',
                        borderRadius: 2,
                        display: 'inline-block',
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#1e293b', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                color="white"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 800,
                  mb: 4,
                }}
              >
                Why Businesses Choose FlowDesk
              </Typography>
              <List>
                {[
                  'Save 10+ hours per month on invoicing',
                  'Get paid 2x faster with professional invoices',
                  'Never lose track of unpaid invoices',
                  'Scale your business with automated workflows',
                  'Access your invoices from anywhere',
                  'Bank-level security for your data',
                ].map((item, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <CheckIcon sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        fontSize: '1.1rem',
                        color: 'white',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  p: 4,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="h5" fontWeight={700} mb={3} color="white">
                  Join thousands of businesses
                </Typography>
                <Typography variant="body1" mb={4} sx={{ opacity: 0.9 }} color="white">
                  From freelancers to growing companies, FlowDesk helps businesses 
                  of all sizes manage their invoicing efficiently.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: '#1e293b',
                    py: 2,
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
                  Get Started Free
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Coming Soon Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#fef3c7' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              mb: 2,
              textAlign: 'center',
              color: '#92400e',
            }}
          >
            🚀 Premium Features Coming Soon
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ textAlign: 'center', mb: 4, color: '#b45309' }}
          >
            Use FlowDesk 100% FREE today. Early adopters get 30% off premium plans!
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 3, 
                height: '100%', 
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': { boxShadow: 4 }
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#92400e', fontWeight: 600 }}>
                  🤖 AI Payment Predictor
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  World's first! AI predicts when each client will pay based on their history. 
                  Get cash flow forecasts and automatic follow-up scheduling.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 3, 
                height: '100%', 
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': { boxShadow: 4 }
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#92400e', fontWeight: 600 }}>
                  🎯 Smart Invoice Optimization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A/B test invoice designs, payment terms, and send times. 
                  AI automatically optimizes for fastest payment per client.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 3, 
                height: '100%', 
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': { boxShadow: 4 }
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#92400e', fontWeight: 600 }}>
                  ⚡ Smart Payment Incentives
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automate early payment discounts with gamification. 
                  Clients see "rewards", you get paid 20 days faster.
                </Typography>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#92400e',
                color: 'white',
                py: 1.5,
                px: 4,
                '&:hover': {
                  bgcolor: '#78350f',
                },
              }}
            >
              Start Free & Get Early Access Benefits
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              background: 'white',
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ready to Streamline Your Invoicing?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: '#64748b' }}
            >
              Join 10,000+ businesses using FlowDesk to manage their invoices
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: '#1e293b',
                  color: 'white',
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px 0 rgba(30, 41, 59, 0.2)',
                  '&:hover': {
                    bgcolor: '#0f172a',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px 0 rgba(30, 41, 59, 0.3)',
                  },
                  transition: 'all 0.3s',
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Start Free Forever
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/features"
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#94a3b8',
                    bgcolor: '#f8fafc',
                  },
                }}
              >
                View All Features
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/contact"
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#94a3b8',
                    bgcolor: '#f8fafc',
                  },
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
      
      {/* Add padding at bottom to account for fixed footer */}
      <Box sx={{ pb: 30 }} />
      
      <Footer />
    </>
  );
};

export default LandingPage;
