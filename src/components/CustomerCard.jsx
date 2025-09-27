import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const CustomerCard = ({
  customer,
  onEdit,
  onDelete,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  selectedCustomerId,
}) => {
  const isMenuOpen = Boolean(anchorEl) && selectedCustomerId === customer.id;
  
  const handleAction = (action) => {
    action();
    onMenuClose();
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        '&:active': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
        }
      }}
    >
      {/* Header Row */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Box flex={1}>
          <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
            {customer.name}
          </Typography>
          {customer.company && (
            <Typography variant="body2" color="text.secondary">
              <BusinessIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
              {customer.company}
            </Typography>
          )}
        </Box>
        
        <IconButton
          size="small"
          onClick={(event) => onMenuOpen(event, customer.id)}
          sx={{ mt: -0.5, mr: -0.5 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Compact Contact Info */}
      <Stack spacing={0.5}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ wordBreak: 'break-word' }}>
            {customer.email}
          </Typography>
        </Box>
        
        {customer.phone && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">
              {customer.phone}
            </Typography>
          </Box>
        )}
        
        {customer.address?.city && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <HomeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">
              {customer.address.city}
              {customer.address.state && `, ${customer.address.state}`}
              {customer.address.country && `, ${customer.address.country}`}
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={onMenuClose}
      >
        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
        )}
        {onDelete && (
          <>
            <Divider />
            <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default CustomerCard;
