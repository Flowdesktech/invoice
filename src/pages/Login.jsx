import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import GoogleLogo from '../components/GoogleLogo';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, signInWithGoogle, accounts } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAddingAccount = searchParams.get('addAccount') === 'true';
  const switchToEmail = searchParams.get('switchTo');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: switchToEmail || '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password, isAddingAccount);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // If the email is linked to Google, highlight the Google sign-in button
      if (error.message === 'EMAIL_LINKED_TO_GOOGLE') {
        // Add a visual indicator to the Google button
        const googleButton = document.getElementById('google-signin-button');
        if (googleButton) {
          googleButton.classList.add('pulse-animation');
          setTimeout(() => {
            googleButton.classList.remove('pulse-animation');
          }, 3000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      {/* React 19 Metadata for SEO */}
      <title>Login - FlowDesk Invoice Management | Sign In to Your Account</title>
      <meta name="description" content="Sign in to FlowDesk to manage your invoices, track payments, and grow your business. Secure login for the best invoice management software." />
      <meta name="keywords" content="flowdesk login, invoice management login, business software login, sign in" />
      <link rel="canonical" href="https://flowdesk.tech/login" />
      
      <Header />
      
      <Container component="main" maxWidth="xs" sx={{ pt: 10 }} style={{ minHeight: '800px' }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Logo variant="full" size="large" />
          </Box>
          <Typography component="h2" variant="h6" align="center" color="text.secondary" gutterBottom>
            {isAddingAccount ? 'Add another account' : switchToEmail ? 'Switch account' : 'Sign in to your account'}
          </Typography>
          {isAddingAccount && accounts.length > 0 && (
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
              You currently have {accounts.length} account{accounts.length > 1 ? 's' : ''} connected
            </Typography>
          )}
          {switchToEmail && (
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
              Switching to {switchToEmail}
            </Typography>
          )}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email Address *"
              type="email"
              margin="normal"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            
            <TextField
              fullWidth
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            
            {(isAddingAccount || switchToEmail) && (
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 2 }}
              >
                Cancel
              </Button>
            )}
            
            <Divider sx={{ my: 2 }}>OR</Divider>
            
            <Button
              id="google-signin-button"
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              startIcon={googleLoading ? null : <GoogleLogo size={18} />}
              sx={{ 
                mb: 2,
                textTransform: 'none',
                backgroundColor: '#fff',
                color: '#3c4043',
                borderColor: '#dadce0',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 500,
                py: 1.5,
                boxShadow: '0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: '#dadce0',
                  boxShadow: '0 1px 2px 0 rgba(60,64,67,.30), 0 2px 6px 2px rgba(60,64,67,.15)',
                },
                '&.pulse-animation': {
                  animation: 'pulse 1s ease-in-out 3',
                  borderColor: '#4285f4',
                  boxShadow: '0 0 0 4px rgba(66, 133, 244, 0.3)',
                },
                '&:disabled': {
                  backgroundColor: '#fff',
                  color: '#3c4043',
                  opacity: 0.6,
                },
              }}
            >
              {googleLoading ? <CircularProgress size={20} sx={{ color: '#4285f4' }} /> : 'Sign in with Google'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
    
    <Footer />
    
    {/* Add CSS for pulse animation */}
    <style jsx>{`
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(66, 133, 244, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
        }
      }
    `}</style>
    </>
  );
};

export default Login;
