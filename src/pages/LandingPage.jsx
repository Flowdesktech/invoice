import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Header from '../components/Header';
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
    { label: 'Professional Templates', value: '15+' },
    { label: 'Setup Time', value: '< 2 min' },
    { label: 'Payment Tracking', value: '100%' },
    { label: 'Free Forever', value: '✓' },
  ];

  return (
    <>
      {/* React 19 Metadata - Optimized for SEO */}
      <title>FlowDesk - Free Invoice Management Software for Small Business | Get Paid Faster</title>
      <meta name="description" content="Create professional invoices in seconds. Free invoice software with automated reminders, payment tracking, and recurring billing. Choose from 15 professional templates. No credit card required." />
      <meta name="keywords" content="free invoice software, invoice generator online, small business invoicing, freelance billing software, payment tracking app, recurring invoices, invoice management system, get paid faster, invoice templates, billing automation" />
      <link rel="canonical" href="https://flowdesk.tech" />
      
      {/* Open Graph for Social Sharing */}
      <meta property="og:title" content="FlowDesk - Professional Invoice Management Made Simple" />
      <meta property="og:description" content="Stop chasing payments. Create, send, and track invoices with FlowDesk's free invoice management software. Get paid faster with professional invoices." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://flowdesk.tech" />
      <meta property="og:image" content="https://flowdesk.tech/og-image.png" />
      <meta property="og:site_name" content="FlowDesk" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="FlowDesk - Get Paid Faster with Free Invoice Software" />
      <meta name="twitter:description" content="Professional invoicing made simple. Create, send, track invoices and get paid faster. Free forever for small businesses." />
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

      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
          color: '#1e293b',
          pt: { xs: 12, md: 16 },  // Increased padding to account for header
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Professional Abstract Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '100%',
            opacity: 0.03,
            background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e293b' stroke-width='1' opacity='0.3'%3E%3Cpath d='M0 0h100v100H0z'/%3E%3Cpath d='M0 50h100M50 0v100'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            transform: 'skewY(-6deg)',
            transformOrigin: '100% 0',
          }}
        />
        
        {/* Subtle Wave Design */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.02) 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: `url("data:image/svg+xml,%3Csvg width='1440' height='320' viewBox='0 0 1440 320' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='rgba(59, 130, 246, 0.03)' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom',
            }
          }}
        />
        
        {/* Professional Gradient Accent */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '40%',
            height: '140%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
            filter: 'blur(100px)',
            transform: 'rotate(-15deg)',
            pointerEvents: 'none',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1000}>
                <Box>
                  {/* Small Tag */}
                  <Box sx={{ mb: 3 }}>
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
                      }}
                    >
                      PROFESSIONAL INVOICE SOFTWARE
                    </Typography>
                  </Box>
                  
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
                    Get Paid Faster With
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
                      Professional Invoices
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
                    }}
                  >
                    Choose from 15 professional templates, automate your billing workflow, 
                    and reduce payment delays. Everything you need to get paid faster.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        py: 2,
                        px: 5,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Start Free - No Card Required
                    </Button>
                    <Button
                      variant="text"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        color: '#64748b',
                        py: 2,
                        px: 3,
                        fontSize: '1rem',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(148, 163, 184, 0.08)',
                          color: '#475569',
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      Already have an account?
                    </Button>
                  </Stack>

                  {/* Trust Indicators */}
                  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckIcon sx={{ fontSize: 16, color: '#10b981' }} />
                      No credit card required
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckIcon sx={{ fontSize: 16, color: '#10b981' }} />
                      Setup in under 2 minutes
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckIcon sx={{ fontSize: 16, color: '#10b981' }} />
                      Cancel anytime
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  {/* Professional Invoice Preview */}
                  <Box
                    sx={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      transform: { xs: 'none', md: 'perspective(1000px) rotateY(-10deg)' },
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: { xs: 'none', md: 'perspective(1000px) rotateY(-5deg)' },
                      }
                    }}
                  >
                    {/* Browser Bar */}
                    <Box
                      sx={{
                        background: '#f8fafc',
                        borderBottom: '1px solid #e5e7eb',
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                      </Box>
                      <Box sx={{ 
                        flex: 1, 
                        background: '#ffffff',
                        borderRadius: '6px',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        flowdesk.tech/invoice/INV-00123
                      </Box>
                    </Box>
                    
                    {/* Invoice Content */}
                    <Box sx={{ p: 3, bgcolor: '#ffffff' }}>
                      {/* Invoice Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 4 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box
                              component="img"
                              src="/flowdesk-favicon.svg"
                              alt="FlowDesk"
                              sx={{ width: 32, height: 32 }}
                            />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                              FlowDesk Inc.
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            123 Business Ave<br />
                            San Francisco, CA 94107<br />
                            contact@flowdesk.tech
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Box
                            sx={{
                              display: 'inline-block',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              color: 'white',
                              px: 2,
                              py: 0.5,
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            INVOICE
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            INV-00123
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Date: {new Date().toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Bill To */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="overline" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                          BILL TO
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#0f172a' }}>
                          Acme Corporation
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          456 Client Street<br />
                          New York, NY 10001
                        </Typography>
                      </Box>

                      {/* Invoice Items */}
                      <Box sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            bgcolor: '#f8fafc',
                            p: 1.5,
                            borderRadius: '8px',
                            mb: 1,
                          }}
                        >
                          <Grid container>
                            <Grid item size={6}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                                DESCRIPTION
                              </Typography>
                            </Grid>
                            <Grid item size={2} sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                                QTY
                              </Typography>
                            </Grid>
                            <Grid item size={2} sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                                RATE
                              </Typography>
                            </Grid>
                            <Grid item size={2} sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                                AMOUNT
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                        {[
                          { desc: 'Web Development Services', qty: 40, rate: 125 },
                          { desc: 'UI/UX Design', qty: 20, rate: 100 },
                          { desc: 'Project Management', qty: 10, rate: 80 },
                        ].map((item, i) => (
                          <Box key={i} sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                            <Grid container alignItems="center">
                              <Grid item size={6}>
                                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                                  {item.desc}
                                </Typography>
                              </Grid>
                              <Grid item size={2} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  {item.qty}
                                </Typography>
                              </Grid>
                              <Grid item size={2} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  ${item.rate}
                                </Typography>
                              </Grid>
                              <Grid item size={2} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                                  ${(item.qty * item.rate).toLocaleString()}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>

                      {/* Total */}
                      <Box sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'inline-block', minWidth: 200 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Subtotal
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0f172a' }}>
                              $7,800.00
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Tax (10%)
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0f172a' }}>
                              $780.00
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              pt: 1,
                              mt: 1,
                              borderTop: '2px solid #e5e7eb',
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                              Total
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                              $8,580.00
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* Floating Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                        '100%': { transform: 'scale(1)' },
                      }
                    }}
                  >
                    LIVE PREVIEW
                  </Box>
                  
                  {/* Template Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      px: 2,
                      py: 0.75,
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ fontSize: '0.875rem' }}>✨</Box>
                    Using Modern Blue Template
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: 6, 
        bgcolor: '#fafbfc',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item size={{ xs: 6, md: 3 }} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      position: 'relative',
                      '&:not(:last-child)::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        height: '40px',
                        width: '1px',
                        bgcolor: '#e5e7eb',
                        display: { xs: 'none', md: 'block' }
                      }
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 0.5,
                        lineHeight: 1,
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
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
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
              Built for modern businesses
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
              Everything you need to manage invoices, track payments, and grow your business
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Box
                  sx={{
                    height: '100%',
                    p: 4,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    '&:hover': {
                      '& .feature-icon': {
                        transform: 'scale(1.1)',
                      }
                    }
                  }}
                >
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 56,
                      height: 56,
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      transition: 'transform 0.3s ease',
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
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0f172a', 
                      mb: 2,
                      fontSize: '1.125rem',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b', 
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#1e293b', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item size={{ xs: 12, md: 6 }}>
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
            <Grid item size={{ xs: 12, md: 6 }}>
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
            <Grid item size={{ xs: 12, md: 4 }}>
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
            
            <Grid item size={{ xs: 12, md: 4 }}>
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
            
            <Grid item size={{ xs: 12, md: 4 }}>
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
          <Box sx={{ textAlign: 'center' }}>
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
              Start getting paid faster today
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
              Join thousands of businesses that trust FlowDesk to manage their invoicing and get paid on time
            </Typography>
            
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
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
                component={Link}
                to="/features"
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
                View All Features
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/contact"
                sx={{
                  borderColor: '#cbd5e1',
                  color: 'white',
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#94a3b8',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
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
