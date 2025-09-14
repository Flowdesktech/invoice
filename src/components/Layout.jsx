import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import AccountSwitcher from './AccountSwitcher';
import ProfileDialog from './ProfileDialog';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { userData, logout, profiles, currentUser, currentProfile, switchProfile, addProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices' },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiListItemText-primary': {
          color: '#ffffff',
        },
        '& .MuiListItemIcon-root': {
          color: '#ffffff',
        },
        '& .MuiTypography-root': {
          color: '#ffffff',
        },
      }}
    >
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Logo variant="full" size="large" />
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: 2,
                mx: 0.5,
                color: location.pathname === item.path ? '#ffffff' : 'rgba(255,255,255,0.7)',
                backgroundColor: location.pathname === item.path ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(59, 130, 246, 0.25)' 
                    : 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                },
                '& .MuiListItemIcon-root': {
                  color: location.pathname === item.path ? '#60a5fa' : '#ffffff !important',
                  minWidth: 40,
                },
                '& .MuiListItemText-primary': {
                  color: '#ffffff !important',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 3, my: 2 }} />
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate('/invoices/create');
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            sx={{
              borderRadius: 2,
              mx: 0.5,
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#2563eb',
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
                minWidth: 40,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText 
              primary="New Invoice" 
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'inherit',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      
      {/* Spacer to push AccountSwitcher to bottom */}
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Account Switcher fixed at bottom of sidebar */}
      <Box sx={{ 
        mt: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        p: 2,
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
        <AccountSwitcher
          currentProfile={currentProfile}
          profiles={profiles}
          onSwitchProfile={switchProfile}
          onAddProfile={() => setProfileDialogOpen(true)}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#64748b',
              '&:hover': {
                color: '#1e293b',
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#1e293b',
              fontWeight: 600,
              fontSize: '1.125rem',
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'Invoice Management'}
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              <Tooltip 
                title={
                  currentProfile 
                    ? `Business Profile: ${currentProfile.displayName || currentProfile.company || 'Unnamed Profile'}`
                    : `Personal Account: ${userData?.displayName || userData?.email || 'User'}`
                }
                arrow
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    backgroundColor: currentProfile ? '#3b82f6' : '#6b7280',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {currentProfile 
                    ? (currentProfile.displayName?.charAt(0)?.toUpperCase() || currentProfile.company?.charAt(0)?.toUpperCase() || 'P')
                    : (userData?.displayName?.charAt(0)?.toUpperCase() || 'U')
                  }
                </Avatar>
              </Tooltip>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                },
              }}
            >
              <MenuItem 
                onClick={() => { navigate('/profile'); handleMenuClose(); }}
                sx={{
                  py: 1.5,
                  px: 2,
                  color: '#1e293b',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#64748b', minWidth: 40 }}>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  My Profile
                </Typography>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  px: 2,
                  color: '#ef4444',
                  '&:hover': {
                    backgroundColor: '#fee2e2',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation drawer"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
      
      {/* Profile Dialog */}
      <ProfileDialog 
        open={profileDialogOpen} 
        onClose={() => setProfileDialogOpen(false)} 
      />
    </Box>
  );
};

export default Layout;
