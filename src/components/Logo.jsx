import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo = ({ variant = 'full', size = 'medium' }) => {
  const sizes = {
    small: { icon: 28, text: '1rem' },
    medium: { icon: 36, text: '1.25rem' },
    large: { icon: 48, text: '1.5rem' },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Logo Icon */}
      <Box
        sx={{
          width: currentSize.icon,
          height: currentSize.icon,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="url(#gradient1)"
            opacity="0.1"
          />
          
          {/* Invoice Icon with Flow Effect */}
          <path
            d="M12 8C12 6.89543 12.8954 6 14 6H28L36 14V40C36 41.1046 35.1046 42 34 42H14C12.8954 42 12 41.1046 12 40V8Z"
            fill="url(#gradient2)"
          />
          
          {/* Document Corner */}
          <path
            d="M28 6V14H36L28 6Z"
            fill="#1565C0"
            opacity="0.3"
          />
          
          {/* Flow Lines */}
          <path
            d="M18 20H30M18 26H30M18 32H26"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Flow Arrow */}
          <path
            d="M30 26L34 26M34 26L31 23M34 26L31 29"
            stroke="url(#gradient3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="48" y2="48">
              <stop stopColor="#1976D2" />
              <stop offset="1" stopColor="#42A5F5" />
            </linearGradient>
            <linearGradient id="gradient2" x1="12" y1="6" x2="36" y2="42">
              <stop stopColor="#1976D2" />
              <stop offset="1" stopColor="#1565C0" />
            </linearGradient>
            <linearGradient id="gradient3" x1="30" y1="26" x2="34" y2="26">
              <stop stopColor="#42A5F5" />
              <stop offset="1" stopColor="#1976D2" />
            </linearGradient>
          </defs>
        </svg>
      </Box>

      {/* Logo Text */}
      {variant === 'full' && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: currentSize.text,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}
          >
            FlowDesk
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Logo;
