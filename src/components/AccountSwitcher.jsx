import React, { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const AccountSwitcher = ({ currentProfile, profiles = [], onSwitchProfile, onAddProfile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitch = (profileId) => {
    onSwitchProfile(profileId);
    handleClose();
  };

  const handleAddNewProfile = () => {
    handleClose();
    onAddProfile();
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          p: 1,
          borderRadius: 2,
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: currentProfile === null ? 'grey.600' : 'primary.main',
            fontSize: '0.875rem',
          }}
        >
          {currentProfile === null ? (
            <AccountCircleIcon sx={{ fontSize: 20 }} />
          ) : (
            currentProfile?.name?.charAt(0).toUpperCase() || 
            currentProfile?.company?.charAt(0).toUpperCase() || 'P'
          )}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'white',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentProfile === null ? 'Personal Account' : (currentProfile?.displayName || currentProfile?.company || 'Profile')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {currentProfile === null ? 'Original account data' : (currentProfile?.company || 'No company')}
          </Typography>
        </Box>
        <ExpandMoreIcon sx={{ color: 'white' }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 280,
            '& .MuiList-root': {
              py: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            ACCOUNTS
          </Typography>
        </Box>
        
        {/* Personal Account Option */}
        <MenuItem
          onClick={() => handleSwitch('personal')}
          sx={{
            py: 1.5,
            px: 2,
            backgroundColor: currentProfile === null ? 'action.selected' : 'transparent',
          }}
        >
          <ListItemIcon>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: currentProfile === null ? 'primary.main' : 'grey.600',
                fontSize: '0.875rem',
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 20 }} />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary="Personal Account"
            secondary="Original account data"
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: currentProfile === null ? 600 : 400,
            }}
            secondaryTypographyProps={{
              variant: 'caption',
            }}
          />
          {currentProfile === null && (
            <CheckIcon sx={{ ml: 1, color: 'primary.main' }} fontSize="small" />
          )}
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            BUSINESS PROFILES
          </Typography>
        </Box>
        
        {profiles && Array.isArray(profiles) && profiles.length > 0 && profiles.map((profile) => (
          <MenuItem
            key={profile.id}
            onClick={() => handleSwitch(profile.id)}
            sx={{
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: profile.id === currentProfile?.id ? 'primary.main' : 'grey.400',
                  fontSize: '0.875rem',
                }}
              >
                {profile.displayName?.charAt(0).toUpperCase() || 
                 profile.company?.charAt(0).toUpperCase() || 'P'}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={profile.displayName || profile.company || 'Unnamed Profile'}
              secondary={profile.company || 'No company'}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: profile.id === currentProfile?.id ? 600 : 400,
              }}
              secondaryTypographyProps={{
                variant: 'caption',
              }}
            />
            {profile.id === currentProfile?.id && (
              <CheckIcon sx={{ ml: 1, color: 'primary.main' }} fontSize="small" />
            )}
          </MenuItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem
          onClick={handleAddNewProfile}
          sx={{
            py: 1.5,
            px: 2,
            color: 'primary.main',
          }}
        >
          <ListItemIcon>
            <AddIcon sx={{ color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText
            primary="Add business profile"
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountSwitcher;
