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
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Code as CodeIcon,
  Build as BuildIcon,
  Support as SupportIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudDone as CloudIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  const navigate = useNavigate();

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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pb: 30 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to App
        </Button>

      {/* Hero Section */}
      <Paper sx={{ p: { xs: 3, sm: 6 }, mb: 4, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }} color="white">
          About FlowDesk
        </Typography>
        <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}  color="white">
          Professional invoice management built by a full stack developer who understands business needs.
        </Typography>
        <Typography variant="body1" paragraph  color="white">
          FlowDesk was created to solve real-world invoicing challenges faced by freelancers, consultants, and small businesses. 
          As a full stack developer with years of experience building business applications, I understand the importance of reliable, 
          user-friendly software that just works.
        </Typography>
      </Paper>

      {/* Developer Section */}
      <Paper sx={{ p: { xs: 3, sm: 6 }, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}>
            <CodeIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '600' }}>
              Hi, I'm Your Full Stack Developer
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Passionate about building solutions that make business operations smoother
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" paragraph>
          With expertise in modern web technologies and a deep understanding of business processes, I specialize in creating 
          custom applications that solve real problems. FlowDesk is just one example of how I can help businesses streamline 
          their operations.
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: '600' }}>
          Technologies I Work With
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {techStack.map((tech) => (
            <Chip 
              key={tech} 
              label={tech} 
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Services Section */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: '600', mb: 3 }}>
        How I Can Help Your Business
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ color: 'primary.main', mr: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h6" component="h3">
                    {service.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: '600' }} color="white">
          Need a Custom Solution for Your Business?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}  color="white">
          Whether you need a new application built from scratch, help maintaining existing software, 
          or want to add new features to your current systems, I'm here to help.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ mr: 2 }}
          >
            Get in Touch
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => window.open('mailto:developer@flowdesk.tech')}
          >
            Email Directly
          </Button>
        </Box>
      </Paper>

      {/* Why FlowDesk */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 3 }}>
          Why I Built FlowDesk
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              After working with numerous small businesses and freelancers, I noticed a common pain point: 
              invoice management. Many were using spreadsheets or expensive software with features they didn't need.
            </Typography>
            <Typography variant="body1" paragraph>
              FlowDesk was born from the idea that invoicing should be simple, professional, and accessible. 
              It includes only the features businesses actually use, with a clean interface that doesn't require training.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              This project showcases my approach to development: understanding the problem first, then building 
              a solution that's both powerful and easy to use. Every feature in FlowDesk was carefully considered 
              and implemented with the end user in mind.
            </Typography>
            <Typography variant="body1" paragraph>
              If you need similar custom solutions for your business, I'd love to discuss how I can help 
              streamline your operations with tailored software development.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
    
    <Footer />
    </>
  );
};

export default About;
