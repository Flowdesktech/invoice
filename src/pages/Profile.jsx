import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import timezoneOptions from '../data/timezoneOptions.json';
import currencyOptions from '../data/currencyOptions.json';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
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
      {value === index && <Box sx={{ py: 0 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { userData, currentProfile, updateUserProfile, changePassword } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Re-initialize forms when currentProfile or userData changes
  useEffect(() => {
    // Use currentProfile for business profiles, userData for personal account
    const profileData = currentProfile || userData;
    
    if (profileData) {
      resetProfile({
        displayName: profileData.displayName || '',
        company: profileData.company || '',
        email: profileData.email || '',
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
          displayNameType: profileData.invoiceSettings?.displayNameType || 'business',
          invoiceDisplayName: profileData.invoiceSettings?.invoiceDisplayName || '',
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
    control: controlInvoice,
    reset: resetInvoice,
    watch: watchInvoice,
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
        email: data.email,
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
    <Container maxWidth="md" sx={{ px: { xs: 0, sm: 3 } }}>
      <Box sx={{ mb: 4, px: { xs: 2, sm: 0 } }}>
        <Typography variant="h4" gutterBottom sx={{ display: { xs: 'none', sm: 'block' } }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ display: { xs: 'none', sm: 'block' } }}>
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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              '& .MuiTab-root': {
                minHeight: { xs: 48, sm: 48 },
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                padding: { xs: '6px 4px', sm: '6px 16px' },
                minWidth: { xs: 0, sm: 140 },
                '& .MuiTab-iconWrapper': {
                  marginBottom: 0,
                  marginRight: { xs: 2, sm: 8 },
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }
              },
              '& .MuiTabs-flexContainer': {
                justifyContent: { xs: 'space-between', sm: 'flex-start' }
              }
            }}
          >
            <Tab 
              label={isMobile ? 'Personal' : 'Personal Information'} 
              icon={<PersonIcon />} 
              iconPosition="start" 
            />
            <Tab 
              label={isMobile ? 'Invoice' : 'Invoice Settings'} 
              icon={<SettingsIcon />} 
              iconPosition="start" 
            />
            <Tab 
              label="Security" 
              icon={<LockIcon />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        <Box sx={{ px: 3, py: 2 }}>
          <TabPanel value={activeTab} index={0}>
            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
              <Grid container spacing={3}>
                <Grid item size={{ xs: 12, sm: 6 }}>
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

                <Grid item size={{ xs: 12, sm: 6 }}>
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

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!profileErrors.email}
                    helperText={profileErrors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
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

                <Grid item size={12}>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                </Grid>

                <Grid item size={12}>
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

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    {...registerProfile('address.city')}
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    {...registerProfile('address.state')}
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    {...registerProfile('address.zipCode')}
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Country"
                    {...registerProfile('address.country')}
                  />
                </Grid>

                <Grid item size={12}>
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
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Invoice Prefix"
                    helperText="Prefix for invoice numbers (e.g., INV)"
                    {...registerInvoice('invoiceSettings.prefix')}
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
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

                <Grid item size={{ xs: 12, sm: 6 }}>
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

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="invoiceSettings.currency"
                    control={controlInvoice}
                    defaultValue={userData?.invoiceSettings?.currency || 'USD'}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          {...field}
                          label="Currency"
                        >
                          {currencyOptions.map((currency) => (
                            <MenuItem key={currency.value} value={currency.value}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {currency.symbol}
                                </Typography>
                                <Typography variant="body2">
                                  {currency.label}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          Default currency for invoices
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
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

                <Grid item size={{ xs: 12, sm: 6 }}>
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

                {/* Invoice Display Settings Section */}
                <Grid item size={12}>
                  <Box sx={{ mt: 4, mb: 3 }}>
                    <Divider />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mt: 3, 
                        mb: 1,
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      Invoice Display Name
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Choose how your business name appears on invoices sent to customers
                    </Typography>
                  </Box>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="invoiceSettings.displayNameType"
                    control={controlInvoice}
                    defaultValue={userData?.invoiceSettings?.displayNameType || 'business'}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Display As</InputLabel>
                        <Select
                          {...field}
                          label="Display As"
                        >
                          <MenuItem value="business">Company/Business Name</MenuItem>
                          <MenuItem value="personal">Personal Name</MenuItem>
                          <MenuItem value="custom">Custom Display Name</MenuItem>
                        </Select>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          This name will appear at the top of your invoices
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Custom display name field - only show when custom is selected */}
                {watchInvoice('invoiceSettings.displayNameType') === 'custom' && (
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="invoiceSettings.invoiceDisplayName"
                      control={controlInvoice}
                      defaultValue={userData?.invoiceSettings?.invoiceDisplayName || ''}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Custom Display Name"
                          placeholder="e.g., John Doe Consulting"
                          error={!!fieldState.error}
                          helperText="Enter the exact name to show on invoices"
                          required
                          autoFocus
                        />
                      )}
                    />
                  </Grid>
                )}

                {/* Preview section */}
                <Grid item size={12}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mt: 1,
                      backgroundColor: 'grey.50',
                      borderColor: 'grey.300',
                      borderRadius: 2
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <BusinessIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                      <Box flex={1}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Invoice Header Preview
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {(() => {
                            const displayType = watchInvoice('invoiceSettings.displayNameType') || 'business';
                            const customName = watchInvoice('invoiceSettings.invoiceDisplayName');
                            const profileData = currentProfile || userData;
                            
                            if (displayType === 'business') {
                              return profileData?.company || profileData?.displayName || 'Your Company Name';
                            } else if (displayType === 'personal') {
                              return profileData?.displayName || 'Your Name';
                            } else if (displayType === 'custom' && customName) {
                              return customName;
                            }
                            return 'Enter a custom display name';
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Additional spacing before timezone field */}
                <Grid item size={12}>
                  <Box sx={{ mt: 3, mb: 2 }}>
                    <Divider />
                  </Box>
                </Grid>

                <Grid item size={12}>
                  <Controller
                    name="invoiceSettings.timezone"
                    control={controlInvoice}
                    defaultValue={userData?.invoiceSettings?.timezone || 'America/New_York'}
                    render={({ field }) => {
                      const currentValue = timezoneOptions.find(tz => tz.value === field.value) || 
                                         timezoneOptions.find(tz => tz.value === 'America/New_York');
                      
                      return (
                        <Autocomplete
                          {...field}
                          options={timezoneOptions}
                          groupBy={(option) => option.group}
                          getOptionLabel={(option) => option.label}
                          value={currentValue}
                          onChange={(event, newValue) => {
                            field.onChange(newValue?.value || 'America/New_York');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Timezone"
                              placeholder="Search for a timezone..."
                              fullWidth
                            />
                          )}
                          renderGroup={(params) => (
                            <li key={params.key}>
                              <Box
                                sx={{
                                  position: 'sticky',
                                  top: '-8px',
                                  padding: '4px 16px',
                                  color: 'text.secondary',
                                  backgroundColor: 'background.paper',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {params.group}
                              </Box>
                              <ul style={{ padding: 0 }}>{params.children}</ul>
                            </li>
                          )}
                          isOptionEqualToValue={(option, value) => option.value === value?.value}
                          disableClearable
                          sx={{
                            width: '100%',
                            '& .MuiAutocomplete-listbox': {
                              maxWidth: '600px',
                              '& .MuiAutocomplete-option': {
                                paddingLeft: '24px',
                              },
                            },
                            '& .MuiAutocomplete-paper': {
                              width: '600px !important',
                            },
                          }}
                          PaperComponent={(props) => (
                            <Paper {...props} sx={{ width: '600px' }} />
                          )}
                          ListboxProps={{
                            style: { maxHeight: '400px' }
                          }}
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Payment Terms"
                    multiline
                    rows={3}
                    helperText="Default payment terms for invoices"
                    {...registerInvoice('invoiceSettings.paymentTerms')}
                  />
                </Grid>

                <Grid item size={12}>
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
                <Grid item size={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    For security reasons, you'll need to re-authenticate before changing your password.
                  </Alert>
                </Grid>

                <Grid item size={12}>
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

                <Grid item size={12}>
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

                <Grid item size={12}>
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
