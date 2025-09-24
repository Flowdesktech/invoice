import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useScrollTrigger,
  Slide,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'transform 0.3s ease-in-out',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        }}
        elevation={0}
      >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          {/* Logo */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 'auto',
            }}
          >
            <Box
              component="img"
              src="/flowdesk-favicon.svg"
              alt="FlowDesk Logo"
              sx={{
                width: 40,
                height: 40,
                mr: 2,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              FlowDesk
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Stack direction="row" spacing={1} sx={{ mr: 3, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? '#3b82f6' : '#64748b',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.04)',
                    color: '#3b82f6',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: location.pathname === item.path ? '20px' : '0px',
                    height: '2px',
                    bgcolor: '#3b82f6',
                    borderRadius: '2px',
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* CTA Buttons - Hide on mobile */}
          <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {currentUser ? (
              // Show Dashboard button for signed-in users
              <Button
                variant="contained"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Dashboard
              </Button>
            ) : (
              // Show Sign In and Get Started buttons for non-authenticated users
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: '#e5e7eb',
                    color: '#64748b',
                    fontWeight: 500,
                    textTransform: 'none',
                    px: 3,
                    borderRadius: '8px',
                    '&:hover': {
                      borderColor: '#3b82f6',
                      bgcolor: 'rgba(59, 130, 246, 0.04)',
                      color: '#3b82f6',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Get Started Free
                </Button>
              </>
            )}
          </Stack>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              color: '#64748b',
              ml: 1,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>

    {/* Mobile Drawer */}
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Navigation Links */}
        <List sx={{ mb: 3 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                    color: '#3b82f6',
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.12)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.04)',
                  },
                }}
              >
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mb: 3 }} />

        {/* CTA Buttons */}
        <Stack spacing={2}>
          {currentUser ? (
            <Button
              variant="contained"
              fullWidth
              startIcon={<DashboardIcon />}
              onClick={() => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                py: 1.5,
                borderRadius: '8px',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                },
              }}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#64748b',
                  fontWeight: 500,
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    bgcolor: 'rgba(59, 130, 246, 0.04)',
                    color: '#3b82f6',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  navigate('/register');
                  setMobileMenuOpen(false);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  },
                }}
              >
                Get Started Free
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Drawer>
    </>
  );
};

export default Header;
