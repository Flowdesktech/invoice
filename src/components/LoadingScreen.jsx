import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// Create a fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        zIndex: 9999,
        animation: `${fadeIn} 0.3s ease-in-out`,
      }}
    >
      {/* Logo or Brand Name */}
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          fontWeight: 700,
          color: '#1976d2',
          letterSpacing: '-0.5px'
        }}
      >
        FlowDesk
      </Typography>
      
      {/* Loading Spinner */}
      <CircularProgress 
        size={40} 
        thickness={4}
        sx={{
          color: '#1976d2',
        }}
      />
      
      {/* Optional Loading Text */}
      <Typography 
        variant="body2" 
        sx={{ 
          mt: 2,
          color: '#666',
          fontSize: '0.875rem'
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
