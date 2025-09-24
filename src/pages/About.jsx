import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Divider, Stack, Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Code as CodeIcon,
  Build as BuildIcon,
  Support as SupportIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudDone as CloudIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import FlowBoostWaitlist from '../components/FlowBoostWaitlist';

const About = () => {
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const services = [
    {
      icon: <CodeIcon fontSize="large" />,
      title: 'Full Stack Development',
      description: 'End-to-end web & mobile app development using modern technologies. Expert in React, Node.js, iOS, and Android development.',
    },
    {
      icon: <BuildIcon fontSize="large" />,
      title: 'Mobile App Development',
      description: 'Native iOS (Swift) and Android (Kotlin/Java) apps, plus cross-platform solutions with React Native.',
    },
    {
      icon: <CloudIcon fontSize="large" />,
      title: 'Blockchain & Web3',
      description: 'Smart contracts, DeFi applications, NFT platforms, and Web3 integration using Ethereum, Solana, and other blockchains.',
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: 'AI Integration',
      description: 'Integrate AI/ML capabilities into your applications. ChatGPT, computer vision, predictive analytics, and automation.',
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Cloud & DevOps',
      description: 'AWS, Google Cloud, Firebase, Docker, Kubernetes. Scalable infrastructure and CI/CD pipelines.',
    },
    {
      icon: <SupportIcon fontSize="large" />,
      title: 'Maintenance & Support',
      description: '24/7 support, regular updates, performance optimization, and security patches for all platforms.',
    },
  ];

  const techStack = [
    // Web Development
    'React', 'Node.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
    // Mobile Development
    'Swift', 'iOS', 'Android', 'Kotlin', 'Java', 'React Native', 'Flutter',
    // Backend & Database
    'Express.js', 'MongoDB', 'PostgreSQL', 'Firebase', 'Redis', 'MySQL',
    // Cloud & DevOps
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
    // Blockchain & Web3
    'Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'DeFi', 'NFTs',
    // AI & Machine Learning
    'Python', 'TensorFlow', 'OpenAI', 'Machine Learning', 'ChatGPT', 'LangChain',
    // APIs & Tools
    'REST APIs', 'GraphQL', 'Git', 'Webpack', 'Material-UI', 'Tailwind CSS'
  ];

  return (
    <>
      {/* React 19 SEO Meta Tags - Updated with FlowBoost */}
      <title>About FlowDesk + FlowBoost - Invoice Software with Built-in Earning Platform | Earn $150-500/Month</title>
      <meta name="description" content="FlowDesk with FlowBoost: Revolutionary invoice software that lets you earn $150-500/month during downtime. Built by a full stack developer who created the industry's first invoice + earning platform." />
      <meta name="keywords" content="flowboost creator, flowdesk developer, invoice software with earnings, micro task platform developer, full stack developer, react developer, node.js developer, flowboost innovation, earn while invoicing" />
      <link rel="canonical" href="https://flowdesk.tech/about" />
      
      {/* Open Graph */}
      <meta property="og:title" content="About FlowDesk + FlowBoost - The Creator Behind the Innovation" />
      <meta property="og:description" content="Learn about the developer who created FlowBoost - the industry-first feature that lets you earn money while managing invoices. Available for custom development projects." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://flowdesk.tech/about" />
      
      {/* Structured Data for Developer */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "FlowDesk Developer",
          "jobTitle": "Full Stack Developer",
          "description": "Professional full stack developer specializing in React, Node.js, mobile apps, and blockchain development",
          "knowsAbout": techStack,
          "offers": {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Custom Software Development",
              "description": "Full stack development, mobile apps, maintenance, and support"
            }
          }
        })}
      </script>
      
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
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.5'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
              ABOUT FLOWDESK
            </Typography>
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.875rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.1,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Built for Everyone
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                From Developers to Enterprises
              </Box>
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '0.938rem', sm: '1.125rem', md: '1.25rem' },
                mb: 6,
                color: '#475569',
                fontWeight: 400,
                lineHeight: 1.8,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              FlowDesk was created to solve real invoicing challenges for businesses of any scale. Whether you're 
              an individual developer, a growing SME, or an enterprise - our platform scales with your needs. 
              Simple enough for solo freelancers, powerful enough for large organizations.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, mb: 4 }}>

      {/* Developer Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 3 }}>
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
                  MEET THE DEVELOPER
                </Typography>
              </Box>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.5rem' },
                  color: '#0f172a',
                  letterSpacing: '-0.03em',
                }}
              >
                Hi, I'm a Full Stack Developer
              </Typography>
              
              <Typography variant="h5" sx={{ mb: 4, color: '#64748b', fontWeight: 400, lineHeight: 1.6 }}>
                Passionate about building solutions that make business operations smoother
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: '#475569', lineHeight: 1.8 }}>
                With expertise in modern web technologies and a deep understanding of business processes, I specialize in creating 
                custom applications that solve real problems. FlowDesk is just one example of how I can help businesses streamline 
                their operations.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  py: 1.5,
                  px: 4,
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
              >
                Work With Me
              </Button>
            </Grid>
            
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box 
                sx={{ 
                  bgcolor: '#f8fafc',
                  borderRadius: '16px',
                  p: 4,
                  border: '1px solid #e5e7eb',
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#0f172a' }}>
                  Tech Stack
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {techStack.slice(0, 20).map((tech) => (
                    <Box
                      key={tech}
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: 'white',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#475569',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: '#3b82f6',
                          color: '#3b82f6',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      {tech}
                    </Box>
                  ))}
                </Box>
                <Typography variant="body2" sx={{ mt: 3, color: '#64748b' }}>
                  + many more technologies and frameworks
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#fafbfc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                background: '#ecfdf5',
                color: '#059669',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                mb: 3,
              }}
            >
              SERVICES I OFFER
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 3,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              How I Can Help
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Your Business Grow
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
              From concept to deployment, I provide end-to-end development services
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={service.title}>
                <Box
                  sx={{
                    height: '100%',
                    p: 4,
                    bgcolor: 'white',
                    borderRadius: '16px',
                    border: '1px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px',
                      background: 
                        index % 3 === 0 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 
                        index % 3 === 1 ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: 
                        index % 3 === 0 ? '0 8px 24px -4px rgba(59, 130, 246, 0.3)' : 
                        index % 3 === 1 ? '0 8px 24px -4px rgba(139, 92, 246, 0.3)' : 
                        '0 8px 24px -4px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {React.cloneElement(service.icon, { 
                      sx: { 
                        fontSize: 32, 
                        color: 'white' 
                      } 
                    })}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0f172a' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.7 }}>
                    {service.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FlowBoost Section */}
      <Box sx={{ py: { xs: 10, md: 16 }, background: 'linear-gradient(135deg, #f0f9ff 0%, #f0e7ff 50%, #fff 100%)', position: 'relative' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                mb: 3,
              }}
            >
              COMING SOON: FLOWBOOST
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 3,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              My Vision: FlowBoost
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
                Productivity Meets Opportunity
              </Box>
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                color: '#64748b',
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              I'm developing FlowBoost to solve a common problem: the income gap between invoices. 
              Soon, you'll be able to earn extra income through carefully vetted micro-tasks during business downtime.
            </Typography>
            
            <Alert 
              severity="info" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                mb: 4,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#1e40af',
                '& .MuiAlert-icon': {
                  color: '#3b82f6',
                },
              }}
            >
              <strong>Development Update:</strong> FlowBoost is currently in development. I'm working on partnerships 
              with reputable task providers. Target earning potential: $150-500/month based on similar platforms.
            </Alert>
            
            <Box sx={{ display: 'inline-block' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setWaitlistOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  px: 4,
                  py: 2,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px -4px rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px -4px rgba(59, 130, 246, 0.4)',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                <Box component="span" sx={{ fontSize: '1.5rem' }}>🔔</Box>
                Join FlowBoost Waitlist
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  borderRadius: '16px',
                  border: '2px solid #fef3c7',
                  background: '#fffbeb',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.2)',
                    borderColor: '#fbbf24',
                  },
                }}
              >
                <Box sx={{ fontSize: '2.5rem', mb: 2 }}>💰</Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#92400e' }}>
                  FlowBoost Earnings
                </Typography>
                <Typography variant="body2" sx={{ color: '#78350f', lineHeight: 1.8 }}>
                  Turn downtime into income. Earn $150-500/month completing micro-tasks between invoices. 
                  Smart matching ensures you only see tasks that fit your skills and schedule.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Chip label="EARN DAILY" sx={{ bgcolor: '#f59e0b', color: 'white', fontWeight: 600 }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  borderRadius: '16px',
                  border: '2px solid #e9d5ff',
                  background: '#faf5ff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.2)',
                    borderColor: '#c084fc',
                  },
                }}
              >
                <Box sx={{ fontSize: '2.5rem', mb: 2 }}>🎯</Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#6b21a8' }}>
                  Smart Task Matching
                </Typography>
                <Typography variant="body2" sx={{ color: '#581c87', lineHeight: 1.8 }}>
                  FlowBoost intelligently matches tasks to your skills and availability. Complete surveys, 
                  micro-tasks, and more. Each task is vetted for legitimacy and fair compensation.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Chip label="AI POWERED" sx={{ bgcolor: '#9333ea', color: 'white', fontWeight: 600 }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  borderRadius: '16px',
                  border: '2px solid #dcfce7',
                  background: '#f0fdf4',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.2)',
                    borderColor: '#86efac',
                  },
                }}
              >
                <Box sx={{ fontSize: '2.5rem', mb: 2 }}>⚡</Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#14532d' }}>
                  Daily Engagement Platform
                </Typography>
                <Typography variant="body2" sx={{ color: '#166534', lineHeight: 1.8 }}>
                  FlowBoost transforms FlowDesk from a weekly invoice tool into a daily-use platform. 
                  Build your FlowScore, unlock better tasks, and maximize earnings with consistent activity.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Chip label="DAILY INCOME" sx={{ bgcolor: '#16a34a', color: 'white', fontWeight: 600 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
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
                fontSize: { xs: '1.875rem', sm: '2.25rem', md: '3.5rem' },
                fontWeight: 700,
                color: 'white',
                mb: 3,
                letterSpacing: '-0.03em',
              }}
            >
              Need a Custom Solution?
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
              Whether you need a new application built from scratch or help with existing software, 
              I'm here to bring your ideas to life.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
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
                Start a Project
              </Button>
              <Button
                variant="outlined"
                size="large"
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
                onClick={() => window.open('mailto:contact@flowdesk.tech')}
              >
                Email Directly
              </Button>
            </Stack>
            
            <Box sx={{ mt: 6 }}>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Response within 24 hours • Free consultation • No obligation
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Why FlowDesk Section */}
      <Box sx={{ py: { xs: 10, md: 12 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                background: '#e0e7ff',
                color: '#4338ca',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                mb: 3,
              }}
            >
              THE STORY
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 6,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Why I Built FlowDesk
            </Typography>
          </Box>
          
          <Grid container spacing={6} alignItems="center">
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 4,
                  bgcolor: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  height: '100%',
                }}
              >
                <Box sx={{ fontSize: '2rem', mb: 3 }}>💡</Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#0f172a' }}>
                  The Problem I Saw
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 3 }}>
                  After working with numerous small businesses and freelancers, I noticed a common pain point: 
                  invoice management. Many were using spreadsheets or expensive software with features they didn't need.
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8 }}>
                  Business owners were spending hours on invoicing instead of focusing on their core work. 
                  I knew there had to be a better way.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 4,
                  bgcolor: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  height: '100%',
                }}
              >
                <Box sx={{ fontSize: '2rem', mb: 3 }}>🚀</Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#0f172a' }}>
                  The Solution I Built
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 3 }}>
                  FlowDesk was born from the idea that invoicing should be simple, professional, and accessible. 
                  It includes only the features businesses actually use, with a clean interface that doesn't require training.
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 3 }}>
                  But I didn't stop there. I realized that most freelancers and small businesses face another challenge: 
                  <strong> the income gap between invoices</strong>. That's why I'm developing <strong>FlowBoost</strong>.
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8 }}>
                  FlowBoost will revolutionize how businesses think about downtime. Instead of just waiting for invoice payments, 
                  users will be able to earn $150-500/month completing micro-tasks matched to their skills. 
                  It's the first invoice management system with a built-in earning platform.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Box
              sx={{
                display: 'inline-block',
                p: 4,
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 2 }}>
                Ready to solve your business challenges?
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                If you need similar custom solutions, let's discuss how I can help streamline your operations.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Let's Talk
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Container>
    
    <Footer />
    
    {/* FlowBoost Waitlist Dialog */}
    <FlowBoostWaitlist open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
};

export default About;
