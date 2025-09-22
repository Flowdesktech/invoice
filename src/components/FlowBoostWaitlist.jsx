import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Email as EmailIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { flowBoostAPI } from '../utils/api';
import toast from 'react-hot-toast';

const FlowBoostWaitlist = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessType: '',
    expectedUsage: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.businessType.trim()) {
      newErrors.businessType = 'Business type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await flowBoostAPI.joinWaitlist(formData);
      
      if (response.data.success) {
        setSuccess(true);
        toast.success('Successfully joined the FlowBoost waitlist!');
        
        // Reset form after 3 seconds and close
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            businessType: '',
            expectedUsage: '',
          });
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast.error(error.response?.data?.error || 'Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (success) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              You're on the List!
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              We'll notify you as soon as FlowBoost launches.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Join FlowBoost Waitlist
            </Typography>
            <Chip 
              label="Coming Soon" 
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Alert severity="info" icon={<EmailIcon />}>
              Be among the first to access FlowBoost and start earning $150-500/month during business downtime!
            </Alert>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              autoFocus
            />

            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />

            <TextField
              name="businessType"
              label="Business Type"
              value={formData.businessType}
              onChange={handleChange}
              error={!!errors.businessType}
              helperText={errors.businessType}
              placeholder="e.g., Freelance Designer, Consultant, Agency"
              fullWidth
              required
            />

            <TextField
              name="expectedUsage"
              label="How many hours per week could you dedicate to FlowBoost?"
              value={formData.expectedUsage}
              onChange={handleChange}
              placeholder="e.g., 5-10 hours"
              fullWidth
              multiline
              rows={2}
            />
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 500 }}>
              🎉 Early Access Benefits:
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', mt: 1 }}>
              • First to access FlowBoost when it launches<br />
              • Special launch pricing<br />
              • Priority task matching<br />
              • Exclusive feedback opportunities
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              },
              minWidth: 120,
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Join Waitlist'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FlowBoostWaitlist;
