'use client';

import React from 'react';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { Palette as PaletteIcon, Star as StarIcon } from '@mui/icons-material';

const TemplateThumbnail = ({ template }) => (
  <Box
    sx={{
      width: { xs: 100, sm: 120, md: 140 },
      height: { xs: 140, sm: 170, md: 200 },
      borderRadius: 1,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: '#f8f9fa',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <img
      src={`/template-previews/${template.id}-preview.png`}
      alt={`${template.name} preview`}
      style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
      onError={(event) => {
        const container = event.target.parentNode;
        event.target.style.display = 'none';
        container.style.background = template.preview.primaryColor;
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:14px;text-align:center;padding:10px;">${template.name}</div>`;
      }}
    />
  </Box>
);

const TemplateSelector = ({ template, onChangeTemplate }) => (
  <Paper
    sx={{
      p: { xs: 2, sm: 3 },
      mb: 3,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      background: template ? 'linear-gradient(to right, #f3f4f6, #ffffff)' : 'transparent',
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {template && <TemplateThumbnail template={template} />}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Invoice Template
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {template ? `${template.name} - ${template.description}` : 'Using default template'}
          </Typography>
          {template?.isPremium && (
            <Chip
              label="Premium - Free for Early Adopters"
              size="small"
              color="warning"
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Box>

      <Button variant="outlined" startIcon={<PaletteIcon />} onClick={onChangeTemplate} sx={{ minWidth: 150 }}>
        {template ? 'Change Template' : 'Choose Template'}
      </Button>
    </Box>
  </Paper>
);

export default TemplateSelector;
