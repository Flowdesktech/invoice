import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'Documentation', path: '/docs' },
      { name: 'Contact', path: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    company: [
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        left: { xs: 0, sm: 240 }, // Account for sidebar on desktop
        right: 0,
        backgroundColor: '#f8fafc',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 4,
        zIndex: 1100, // Lower than AppBar (1200)
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              FlowDesk
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Professional invoice management made simple. Create, send, and track invoices with ease.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: '600' }}>
              Product
            </Typography>
            {footerLinks.product.map((link) => (
              <Link
                key={link.name}
                component="button"
                variant="body2"
                onClick={() => navigate(link.path)}
                sx={{
                  display: 'block',
                  mb: 1,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link.name}
              </Link>
            ))}
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: '600' }}>
              Legal
            </Typography>
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                component="button"
                variant="body2"
                onClick={() => navigate(link.path)}
                sx={{
                  display: 'block',
                  mb: 1,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link.name}
              </Link>
            ))}
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: '600' }}>
              Company
            </Typography>
            {footerLinks.company.map((link) => (
              <Link
                key={link.name}
                component="button"
                variant="body2"
                onClick={() => navigate(link.path)}
                disabled={link.path === '#'}
                sx={{
                  display: 'block',
                  mb: 1,
                  color: link.path === '#' ? 'text.disabled' : 'text.secondary',
                  textDecoration: 'none',
                  cursor: link.path === '#' ? 'default' : 'pointer',
                  '&:hover': {
                    color: link.path === '#' ? 'text.disabled' : 'primary.main',
                  },
                }}
              >
                {link.name}
              </Link>
            ))}
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: '600' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: support@flowdesk.tech
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Available Monday - Friday
              <br />
              9:00 AM - 9:00 PM CST
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} FlowDesk. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/privacy')}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/terms')}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Terms
            </Link>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ for businesses everywhere
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
