import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileDialog = ({ open, onClose }) => {
  const { addProfile } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      displayName: '',
      company: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      console.log('ProfileDialog - Form data being submitted:', data);
      await addProfile(data);
      handleClose();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Failed to create profile');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessIcon color="primary" />
            <Typography variant="body1" component="div" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Add Business Profile</Typography>
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item size={12}>
              <Controller
                name="displayName"
                control={control}
                rules={{ required: 'Display name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Display Name"
                    fullWidth
                    error={!!errors.displayName}
                    helperText={errors.displayName?.message}
                    placeholder="e.g., Personal Business, Consulting"
                    autoFocus
                  />
                )}
              />
            </Grid>
            
            <Grid item size={12}>
              <Controller
                name="company"
                control={control}
                rules={{ required: 'Company name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Name"
                    fullWidth
                    error={!!errors.company}
                    helperText={errors.company?.message}
                    placeholder="e.g., ABC Consulting Ltd."
                  />
                )}
              />
            </Grid>
            
            <Grid item size={12}>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Business Email"
                    fullWidth
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    placeholder="e.g., contact@company.com"
                  />
                )}
              />
            </Grid>
            
            <Grid item size={12}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    placeholder="e.g., +1 234 567 8900"
                  />
                )}
              />
            </Grid>
            
            <Grid item size={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Business Address
              </Typography>
            </Grid>
            
            <Grid item size={12}>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street Address"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item size={6}>
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item size={6}>
              <Controller
                name="address.state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="State/Province"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item size={6}>
              <Controller
                name="address.zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ZIP/Postal Code"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item size={6}>
              <Controller
                name="address.country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            startIcon={isSubmitting ? null : <BusinessIcon />}
          >
            {isSubmitting ? 'Creating...' : 'Create Profile'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileDialog;
