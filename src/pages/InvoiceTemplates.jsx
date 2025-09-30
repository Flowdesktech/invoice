import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Fade,
  Paper,
  Stack,
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

// Template data with 15 professional designs
export const templates = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean and professional with blue accents',
    category: 'Modern',
    preview: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#3b82f6',
      style: 'modern',
      layout: 'standard',
    },
  },
  {
    id: 'minimalist-gray',
    name: 'Minimalist Gray',
    description: 'Simple and elegant with subtle gray tones',
    category: 'Minimalist',
    preview: {
      primaryColor: '#374151',
      secondaryColor: '#9ca3af',
      style: 'minimalist',
      layout: 'clean',
    },
  },
  {
    id: 'corporate-dark',
    name: 'Corporate Dark',
    description: 'Professional dark theme for enterprises',
    category: 'Corporate',
    preview: {
      primaryColor: '#111827',
      secondaryColor: '#4b5563',
      style: 'corporate',
      layout: 'formal',
    },
  },
  {
    id: 'creative-orange',
    name: 'Creative Orange',
    description: 'Bold and creative with orange highlights',
    category: 'Creative',
    preview: {
      primaryColor: '#ea580c',
      secondaryColor: '#fb923c',
      style: 'creative',
      layout: 'modern',
    },
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Sophisticated design with purple accents',
    category: 'Elegant',
    preview: {
      primaryColor: '#7c3aed',
      secondaryColor: '#a78bfa',
      style: 'elegant',
      layout: 'premium',
    },
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    description: 'Nature-inspired with fresh green colors',
    category: 'Modern',
    preview: {
      primaryColor: '#16a34a',
      secondaryColor: '#4ade80',
      style: 'fresh',
      layout: 'clean',
    },
  },
  {
    id: 'classic-navy',
    name: 'Classic Navy',
    description: 'Traditional design with navy blue theme',
    category: 'Classic',
    preview: {
      primaryColor: '#1e293b',
      secondaryColor: '#475569',
      style: 'classic',
      layout: 'traditional',
    },
  },
  {
    id: 'tech-gradient',
    name: 'Tech Gradient',
    description: 'Modern gradient design for tech companies',
    category: 'Tech',
    preview: {
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8',
      style: 'gradient',
      layout: 'modern',
    },
  },
  {
    id: 'bold-black-yellow',
    name: 'Bold Contrast',
    description: 'High contrast black and yellow design',
    category: 'Bold',
    preview: {
      primaryColor: '#000000',
      secondaryColor: '#fbbf24',
      style: 'bold',
      layout: 'impact',
    },
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    description: 'Gentle pastel colors for a softer look',
    category: 'Soft',
    preview: {
      primaryColor: '#e0e7ff',
      secondaryColor: '#c7d2fe',
      style: 'pastel',
      layout: 'gentle',
    },
  },
  {
    id: 'professional-teal',
    name: 'Professional Teal',
    description: 'Business-ready with teal accents',
    category: 'Professional',
    preview: {
      primaryColor: '#0d9488',
      secondaryColor: '#14b8a6',
      style: 'professional',
      layout: 'business',
    },
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Premium feel with gold highlights',
    category: 'Luxury',
    preview: {
      primaryColor: '#a16207',
      secondaryColor: '#d97706',
      style: 'luxury',
      layout: 'premium',
    },
  },
  {
    id: 'startup-pink',
    name: 'Startup Pink',
    description: 'Modern and energetic pink design',
    category: 'Startup',
    preview: {
      primaryColor: '#db2777',
      secondaryColor: '#ec4899',
      style: 'startup',
      layout: 'dynamic',
    },
  },
  {
    id: 'accounting-blue',
    name: 'Accounting Blue',
    description: 'Traditional accounting firm style',
    category: 'Accounting',
    preview: {
      primaryColor: '#1e40af',
      secondaryColor: '#2563eb',
      style: 'accounting',
      layout: 'structured',
    },
  },
  {
    id: 'consulting-gray',
    name: 'Consulting Gray',
    description: 'Professional consulting firm template',
    category: 'Consulting',
    preview: {
      primaryColor: '#4b5563',
      secondaryColor: '#6b7280',
      style: 'consulting',
      layout: 'executive',
    },
  },
];

const InvoiceTemplates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = ['All', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template) => {
    // Navigate back to the return path with template ID as query parameter
    const returnPath = location.state?.returnPath || '/invoices/create';
    
    // Parse the return path to handle both create and edit URLs
    const url = new URL(returnPath, window.location.origin);
    url.searchParams.set('templateId', template.id);
    
    // Navigate with the template ID in query params
    navigate(url.pathname + url.search);
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  // Render template preview using PNG images
  const renderTemplatePreview = (template) => {
    return (
      <Box
        sx={{
          height: 350,
          position: 'relative',
          background: '#f8f9fa',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={`/template-previews/${template.id}-preview.png`}
          alt={`${template.name} preview`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <Box
          sx={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            bgcolor: template.preview.primaryColor,
            color: 'white',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {template.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Preview image not available
          </Typography>
        </Box>
      </Box>
    );
  };

  // Full preview modal
  const renderFullPreview = () => {
    if (!selectedTemplate) return null;
    
    return (
      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setIsFullscreen(false);
        }}
        maxWidth={isFullscreen ? false : "md"}
        fullWidth
        fullScreen={isFullscreen}
        PaperProps={{
          sx: { 
            height: isFullscreen ? '100vh' : '90vh',
            bgcolor: isFullscreen ? '#000' : 'background.paper'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              onClick={() => setIsFullscreen(!isFullscreen)}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              onClick={() => {
                setPreviewOpen(false);
                setIsFullscreen(false);
              }}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isFullscreen ? '#000' : '#f5f5f5',
              p: isFullscreen ? 4 : 2,
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2,
                color: isFullscreen ? 'white' : 'text.primary'
              }}
            >
              {selectedTemplate.name}
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: isFullscreen ? '90%' : 800,
                height: isFullscreen ? '90%' : 'calc(100% - 100px)',
                bgcolor: 'white',
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={`/template-previews/${selectedTemplate.id}-full.png`}
                alt={`${selectedTemplate.name} full preview`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.target.src = `/template-previews/${selectedTemplate.id}-preview.png`;
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => handleSelectTemplate(selectedTemplate)}
            startIcon={<CheckIcon />}
          >
            Use This Template
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {/* React 19 Metadata */}
      <title>Invoice Templates - FlowDesk Business Management Platform | 15 Professional Designs</title>
      <meta name="description" content="Choose from 15 professional invoice templates in FlowDesk's free forever business management platform. Modern, minimalist, corporate, and creative styles - all features included free, no credit card required." />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          pt: { xs: 10, md: 12 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Chip
              label="All Premium Templates Included Free Forever"
              color="success"
              size="small"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Professional Invoice Templates
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: '#64748b', maxWidth: 600, mx: 'auto' }}
            >
              Choose from 15 beautifully designed templates. All premium features are included in our free forever business management platform.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Category Filter */}
      <Box sx={{ bgcolor: 'white', py: 2, borderBottom: '1px solid #e5e7eb' }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: 2,
                  bgcolor: selectedCategory === category ? '#1e293b' : '#f1f5f9',
                  color: selectedCategory === category ? 'white' : '#475569',
                  '&:hover': {
                    bgcolor: selectedCategory === category ? '#334155' : '#e2e8f0',
                  },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Templates Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {filteredTemplates.map((template) => (
            <Grid item key={template.id} size={{xs: 12, md: 6, lg: 4}}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {template.isPremium && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: '0.9rem' }} />}
                    label="Premium - Included Free Forever"
                    size="small"
                    color="success"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1,
                    }}
                  />
                )}
                
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Template Preview */}
                  {renderTemplatePreview(template)}
                  
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    {template.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                    {template.description}
                  </Typography>
                  
                  <Chip 
                    label={template.category} 
                    size="small" 
                    sx={{ 
                      alignSelf: 'flex-start',
                      bgcolor: '#f1f5f9',
                      color: '#475569',
                    }}
                  />
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    onClick={() => handlePreview(template)}
                    sx={{ flex: 1 }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={() => handleSelectTemplate(template)}
                    sx={{ flex: 1 }}
                  >
                    Use
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Full Preview Modal */}
      {renderFullPreview()}

    </>
  );
};

export default InvoiceTemplates;
