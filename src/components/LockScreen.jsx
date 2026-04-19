'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Fade,
} from '@mui/material';
import { Lock as LockIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAppLock } from '../contexts/AppLockContext';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const LockScreen = () => {
  const { unlock } = useAppLock();
  const { logout } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pin || submitting) return;

    setSubmitting(true);
    setError('');
    const success = await unlock(pin);
    setSubmitting(false);

    if (!success) {
      setError('Incorrect PIN. Try again.');
      setPin('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleForgotPin = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const handlePinChange = (event) => {
    // Only allow digits, max 12 chars
    const value = event.target.value.replace(/\D/g, '').slice(0, 12);
    setPin(value);
    if (error) setError('');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        p: 2,
      }}
    >
      <Fade in timeout={300}>
        <Paper
          elevation={12}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            textAlign: 'center',
            animation: shake ? 'shake 0.45s ease-in-out' : 'none',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '20%, 60%': { transform: 'translateX(-10px)' },
              '40%, 80%': { transform: 'translateX(10px)' },
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Logo variant="full" size="large" />
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: '#fff',
              mb: 2,
            }}
          >
            <LockIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            App Locked
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your PIN to continue
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              inputRef={inputRef}
              fullWidth
              type="password"
              value={pin}
              onChange={handlePinChange}
              error={!!error}
              helperText={error || ' '}
              placeholder="Enter PIN"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                autoComplete: 'off',
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5em',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color={error ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!pin || submitting}
              sx={{ mt: 1 }}
            >
              Unlock
            </Button>
          </form>

          <Button
            onClick={handleForgotPin}
            startIcon={<LogoutIcon />}
            size="small"
            color="inherit"
            sx={{ mt: 3, color: 'text.secondary' }}
          >
            Forgot PIN? Sign out
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LockScreen;
