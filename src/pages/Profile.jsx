import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Divider,
  Tab,
  Tabs,
  InputAdornment,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { userData, currentProfile, updateUserProfile, changePassword } = useAuth();
  
  // Re-initialize forms when currentProfile or userData changes
  useEffect(() => {
    // Use currentProfile for business profiles, userData for personal account
    const profileData = currentProfile || userData;
    
    if (profileData) {
      resetProfile({
        displayName: profileData.displayName || '',
        company: profileData.company || '',
        phone: profileData.phone || '',
        address: {
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          zipCode: profileData.address?.zipCode || '',
          country: profileData.address?.country || '',
        },
      });
      
      resetInvoice({
        invoiceSettings: {
          prefix: profileData.invoiceSettings?.prefix || 'INV',
          nextNumber: profileData.invoiceSettings?.nextNumber || 1,
          taxRate: profileData.invoiceSettings?.taxRate || 0,
          currency: profileData.invoiceSettings?.currency || 'USD',
          paymentTerms: profileData.invoiceSettings?.paymentTerms || 'Due on receipt',
          dueDateDuration: profileData.invoiceSettings?.dueDateDuration || 7,
          autoIncrementNumber: profileData.invoiceSettings?.autoIncrementNumber !== false,
        },
      });
    }
  }, [currentProfile, userData]);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm();

  const {
    register: registerInvoice,
    handleSubmit: handleSubmitInvoice,
    reset: resetInvoice,
    formState: { errors: invoiceErrors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword,
  } = useForm();

  const password = watch('newPassword');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      // Only send profile-related fields
      const profileData = {
        displayName: data.displayName,
        company: data.company,
        phone: data.phone,
        address: data.address
      };
      
      await updateUserProfile(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitInvoice = async (data) => {
    try {
      setLoading(true);
      // Only send invoice settings
      await updateUserProfile({ invoiceSettings: data.invoiceSettings });
    } catch (error) {
      console.error('Error updating invoice settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      setPasswordLoading(true);
      await changePassword(data.newPassword);
      resetPassword();
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage your account settings and preferences
        </Typography>
        {currentProfile && (
          <Chip
            label={`Business Profile: ${currentProfile.displayName || currentProfile.company}`}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
        {!currentProfile && (
          <Chip
            label="Personal Account"
            color="secondary"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Information" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Invoice Settings" icon={<SettingsIcon />} iconPosition="start" />
            <Tab label="Security" icon={<LockIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    error={!!profileErrors.displayName}
                    helperText={profileErrors.displayName?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...registerProfile('displayName', {
                      required: 'Name is required',
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...registerProfile('company')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...registerProfile('phone')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...registerProfile('address.street')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    {...registerProfile('address.city')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    {...registerProfile('address.state')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    {...registerProfile('address.zipCode')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    {...registerProfile('address.country')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <form onSubmit={handleSubmitInvoice(onSubmitInvoice)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Invoice Prefix"
                    helperText="Prefix for invoice numbers (e.g., INV)"
                    {...registerInvoice('invoiceSettings.prefix')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Next Invoice Number"
                    type="number"
                    helperText="The next invoice number to be used"
                    {...registerInvoice('invoiceSettings.nextNumber', {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Default Tax Rate (%)"
                    type="number"
                    helperText="Default tax rate for invoices"
                    {...registerInvoice('invoiceSettings.taxRate', {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Currency"
                    helperText="Default currency for invoices"
                    {...registerInvoice('invoiceSettings.currency')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Default Due Date Duration (days)"
                    type="number"
                    helperText="Number of days from invoice date to due date"
                    {...registerInvoice('invoiceSettings.dueDateDuration', {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        {...registerInvoice('invoiceSettings.autoIncrementNumber')}
                        defaultChecked={userData?.invoiceSettings?.autoIncrementNumber !== false}
                      />
                    }
                    label="Auto-increment invoice numbers"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Terms"
                    multiline
                    rows={3}
                    helperText="Default payment terms for invoices"
                    {...registerInvoice('invoiceSettings.paymentTerms')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Settings'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    For security reasons, you'll need to re-authenticate before changing your password.
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || 'Passwords do not match',
                    })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="primary"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? <CircularProgress size={24} /> : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
