import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  MenuItem,
  Select,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Zoom,
  Grow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Preview as PreviewIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { templates } from './InvoiceTemplates';
import { publicInvoiceAPI } from '../utils/publicApi';
import { openPdfInNewTab, downloadPdf } from '../utils/pdfUtils';
import { formatCurrency } from '../utils/formatters';
import currencyOptions from '../data/currencyOptions.json';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PublicInvoiceSEO from '../components/PublicInvoiceSEO';

const PublicInvoiceGenerator = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Local storage key - unique to public invoice generator to avoid conflicts
  const DRAFT_KEY = 'publicInvoiceDraft';
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [previewPdf, setPreviewPdf] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [lastGeneratedPdf, setLastGeneratedPdf] = useState(null); // Store for re-download
  const [validationErrors, setValidationErrors] = useState({});
  const [hasDraft, setHasDraft] = useState(false);
  
  // Invoice form data
  const [invoiceData, setInvoiceData] = useState({
    // Sender info
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    
    // Customer info
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    
    // Invoice details
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    
    // Items
    items: [{
      description: '',
      quantity: 1,
      price: 0
    }],
    
    // Tax
    taxRate: 0,
    
    // Payment terms
    paymentTerms: 'Due on receipt',
    
    // Notes
    notes: ''
  });

  const steps = ['Invoice Details', 'Preview & Download'];

  // Sample data for demonstration
  const sampleData = {
    senderName: 'Acme Corporation',
    senderEmail: 'billing@acmecorp.com',
    senderPhone: '(555) 123-4567',
    senderAddress: '123 Business St, Suite 100, New York, NY 10001',
    customerName: 'TechStartup Inc.',
    customerEmail: 'accounts@techstartup.com',
    customerAddress: '456 Innovation Drive, San Francisco, CA 94105',
    invoiceNumber: 'INV-001',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    items: [
      { description: 'Website Development', quantity: 1, price: 5000 },
      { description: 'Logo Design', quantity: 1, price: 1500 },
      { description: 'Monthly Maintenance (3 months)', quantity: 3, price: 500 }
    ],
    taxRate: 10,
    paymentTerms: 'Net 30',
    notes: 'Thank you for your business! Please remit payment within 30 days.'
  };

  // Load draft from localStorage on mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setInvoiceData(draft.invoiceData);
        setSelectedTemplate(templates.find(t => t.id === draft.templateId) || templates[0]);
        setHasDraft(true);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save to localStorage (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const draft = {
        invoiceData,
        templateId: selectedTemplate.id,
        timestamp: Date.now()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setHasDraft(true);
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [invoiceData, selectedTemplate]);

  const validateForm = () => {
    const errors = {};
    
    // Validate customer name
    if (!invoiceData.customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }
    
    // Validate at least one valid line item
    const hasValidLineItem = invoiceData.items.some(item => 
      item.description.trim() && item.quantity > 0 && item.price > 0
    );
    
    if (!hasValidLineItem) {
      errors.items = 'At least one line item with description, quantity and price is required';
    }
    
    // Optional but recommended fields
    if (!invoiceData.senderName.trim()) {
      errors.senderName = 'Business name is recommended';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Final step - download the invoice
      await handleDownload();
    } else {
      // Validate form before generating preview
      if (!validateForm()) {
        return;
      }
      
      // Generate preview before moving to preview step
      await generatePreview();
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateInvoiceData = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field when user updates it
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData(prev => ({
      ...prev,
      items: newItems
    }));
    
    // Clear items validation error when user updates any item
    if (validationErrors.items) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.items;
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => 
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0), 0
    );
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * ((parseFloat(invoiceData.taxRate) || 0) / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generatePreview = async () => {
    setLoadingPreview(true);
    try {
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTax();
      const total = calculateTotal();
      const invoicePayload = {
        ...invoiceData,
        lineItems: invoiceData.items.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.price) || 0
        })),
        subtotal,
        taxRate: parseFloat(invoiceData.taxRate) || 0,
        taxAmount,
        total,
        templateId: selectedTemplate.id
      };
      
      const response = await publicInvoiceAPI.preview(invoicePayload);
      setPreviewPdf(response.data.pdfBase64);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to generate preview. Please try again.');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTax();
      const total = calculateTotal();
      const invoicePayload = {
        ...invoiceData,
        lineItems: invoiceData.items.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.price) || 0
        })),
        subtotal,
        taxRate: parseFloat(invoiceData.taxRate) || 0,
        taxAmount,
        total,
        templateId: selectedTemplate.id
      };
      
      const response = await publicInvoiceAPI.generatePdf(invoicePayload);
      
      // Handle the PDF response
      if (response.data.pdfBase64) {
        // Store PDF data for re-download
        setLastGeneratedPdf({
          data: response.data.pdfBase64,
          filename: `invoice-${invoiceData.invoiceNumber}.pdf`
        });
        
        // Download the PDF directly
        downloadPdf(response.data.pdfBase64, `invoice-${invoiceData.invoiceNumber}.pdf`);
        
        // Show signup dialog after download
        setTimeout(() => setShowSignupDialog(true), 1000);
        
        // Clear draft after successful download
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
      } else {
        alert('Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoadingDownload(false);
    }
  };

  const fillSampleData = () => {
    setInvoiceData(sampleData);
    setValidationErrors({});
  };

  const clearDraft = async () => {
    const result = await Swal.fire({
      title: 'Clear Draft',
      text: 'Are you sure you want to clear all data? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear all data',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      // Reset to initial state
      setInvoiceData({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        senderAddress: '',
        customerName: '',
        customerEmail: '',
        customerAddress: '',
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: 'USD',
        items: [{
          description: '',
          quantity: 1,
          price: 0
        }],
        taxRate: 0,
        paymentTerms: 'Due on receipt',
        notes: ''
      });
      setActiveStep(0);
      setShowPreview(false);
    }
  };

  const renderTemplateSelectionModal = () => (
    <Dialog 
      open={showTemplateDialog} 
      onClose={() => setShowTemplateDialog(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Choose Invoice Template
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Select from our professionally designed templates
            </Typography>
          </Box>
          <IconButton onClick={() => setShowTemplateDialog(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {templates.map((template, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: selectedTemplate.id === template.id ? 2 : 1,
                  borderColor: selectedTemplate.id === template.id ? 'primary.main' : 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowTemplateDialog(false);
                }}
              >
                <Box sx={{ 
                  position: 'relative', 
                  overflow: 'hidden',
                  height: 220,
                  bgcolor: 'grey.50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CardMedia
                    component="img"
                    image={`/template-previews/${template.id}-preview.png`}
                    alt={`${template.name} template preview`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                      ...(selectedTemplate.id === template.id && {
                        transform: 'scale(1.02)'
                      })
                    }}
                    onError={(e) => {
                      e.target.src = '/template-previews/default-preview.png';
                    }}
                  />
                  {selectedTemplate.id === template.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(37, 99, 235, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircleIcon 
                        sx={{ 
                          fontSize: 50,
                          color: 'primary.main',
                          bgcolor: 'white',
                          borderRadius: '50%',
                          p: 1,
                          boxShadow: 2
                        }} 
                      />
                    </Box>
                  )}
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {template.description}
                  </Typography>
                  {template.category && (
                    <Chip 
                      label={template.category} 
                      size="small" 
                      sx={{ mt: 1 }}
                      color={selectedTemplate.id === template.id ? "primary" : "default"}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  const renderInvoiceForm = () => (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Create Invoice
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a template and fill in your invoice details
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={fillSampleData}
              startIcon={<DescriptionIcon />}
              size="small"
            >
              Fill Sample Data
            </Button>
            {hasDraft && (
              <Button
                variant="outlined"
                onClick={clearDraft}
                color="error"
                size="small"
              >
                Clear Draft
              </Button>
            )}
          </Stack>
        </Box>
        {hasDraft && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Your invoice is being auto-saved. We'll restore it if you leave and come back.
          </Alert>
        )}
      </Box>

      {/* Template Selector */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)'
          }
        }}
        onClick={() => setShowTemplateDialog(true)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
            {/* Template Preview Thumbnail */}
            <Box 
              sx={{ 
                width: 69, // 23 * 3 for better visibility
                height: 99, // 33 * 3 for better visibility
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={`/template-previews/${selectedTemplate.id}-preview.png`}
                alt={`${selectedTemplate.name} preview`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = '/template-previews/default-preview.png';
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Invoice Template
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTemplate.name} - {selectedTemplate.description}
              </Typography>
              {selectedTemplate.category && (
                <Chip 
                  label={selectedTemplate.category} 
                  size="small" 
                  sx={{ mt: 0.5 }}
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            size="small"
            endIcon={<ArrowForwardIcon />}
          >
            Change Template
          </Button>
        </Box>
      </Paper>
      
      <Grid container spacing={4}>
        {/* Your Business Info */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BusinessIcon sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Your Business Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={invoiceData.senderName}
                  onChange={(e) => updateInvoiceData('senderName', e.target.value)}
                  variant="outlined"
                  size="medium"
                  error={!!validationErrors.senderName}
                  helperText={validationErrors.senderName}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={invoiceData.senderEmail}
                  onChange={(e) => updateInvoiceData('senderEmail', e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={invoiceData.senderPhone}
                  onChange={(e) => updateInvoiceData('senderPhone', e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={invoiceData.senderAddress}
                  onChange={(e) => updateInvoiceData('senderAddress', e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Customer Info */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonIcon sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Customer Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={invoiceData.customerName}
                  onChange={(e) => updateInvoiceData('customerName', e.target.value)}
                  required
                  variant="outlined"
                  size="medium"
                  error={!!validationErrors.customerName}
                  helperText={validationErrors.customerName}
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Customer Email"
                  type="email"
                  value={invoiceData.customerEmail}
                  onChange={(e) => updateInvoiceData('customerEmail', e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Customer Address"
                  multiline
                  rows={3}
                  value={invoiceData.customerAddress}
                  onChange={(e) => updateInvoiceData('customerAddress', e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Invoice Details */}
        <Grid item size={{ xs: 12 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <DescriptionIcon sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Invoice Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Invoice Date"
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => updateInvoiceData('invoiceDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  value={invoiceData.currency}
                  onChange={(e) => updateInvoiceData('currency', e.target.value)}
                  variant="outlined"
                  size="medium"
                >
                  {currencyOptions.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Items */}
        <Grid item size={{ xs: 12 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Line Items
                </Typography>
              </Box>
              <Button 
                onClick={addItem} 
                variant="contained" 
                size="small"
                startIcon={<AddIcon />}
              >
                Add Item
              </Button>
            </Box>
            
            {/* Validation Error for Line Items */}
            {validationErrors.items && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {validationErrors.items}
              </Alert>
            )}
            
            <Box sx={{ mb: 3 }}>
              {invoiceData.items.map((item, index) => (
                <Paper 
                  key={index} 
                  elevation={0}
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 1
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item size={{ xs: 12, md: 5 }}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        variant="outlined"
                        size="medium"
                        placeholder="Enter item description"
                      />
                    </Grid>
                    <Grid item size={{ xs: 6, sm: 3, md: 2 }}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        variant="outlined"
                        size="medium"
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item size={{ xs: 6, sm: 3, md: 2 }}>
                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        variant="outlined"
                        size="medium"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item size={{ xs: 8, sm: 5, md: 2 }} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {formatCurrency(item.quantity * item.price, invoiceData.currency)}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 4, sm: 1, md: 1 }} sx={{ textAlign: 'center' }}>
                      <IconButton
                        onClick={() => removeItem(index)}
                        disabled={invoiceData.items.length === 1}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box display="flex" justifyContent="flex-end">
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'divider',
                  minWidth: 300
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(calculateSubtotal(), invoiceData.currency)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">Tax</Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={invoiceData.taxRate}
                        onChange={(e) => updateInvoiceData('taxRate', e.target.value)}
                        InputProps={{
                          endAdornment: <Typography variant="body2" sx={{ ml: 0.5 }}>%</Typography>,
                        }}
                        sx={{ width: 80 }}
                      />
                    </Box>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(calculateTax(), invoiceData.currency)}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={600}>Total:</Typography>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {formatCurrency(calculateTotal(), invoiceData.currency)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Payment Terms and Notes */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%'
            }}
          >
            <TextField
              fullWidth
              label="Payment Terms"
              multiline
              rows={3}
              value={invoiceData.paymentTerms || 'Due on receipt'}
              onChange={(e) => updateInvoiceData('paymentTerms', e.target.value)}
              variant="outlined"
              size="medium"
              placeholder="Net 30, Due on receipt, etc..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.50'
                }
              }}
            />
          </Paper>
        </Grid>
        
        {/* Notes */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%'
            }}
          >
            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              value={invoiceData.notes}
              onChange={(e) => updateInvoiceData('notes', e.target.value)}
              variant="outlined"
              size="medium"
              placeholder="Thank you for your business!"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.50'
                }
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPreview = () => (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Invoice Preview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your invoice and download when ready
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12 }}>
          <Paper 
            elevation={0}
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'grey.50'
            }}
          >
            <Box 
              sx={{ 
                p: 3, 
                bgcolor: 'white',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PreviewIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  PDF Preview
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                color="primary"
                disabled={loadingDownload || !showPreview}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
                  }
                }}
              >
                {loadingDownload ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            </Box>
            
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: 800 }}>
              {loadingPreview ? (
                <Box 
                  display="flex" 
                  flexDirection="column"
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight={800}
                  gap={2}
                >
                  <CircularProgress size={60} />
                  <Typography variant="h6" color="text.secondary">
                    Generating your invoice preview...
                  </Typography>
                </Box>
              ) : showPreview ? (
                <iframe
                  src={`data:application/pdf;base64,${previewPdf}`}
                  width="100%"
                  height="800"
                  style={{ 
                    border: 'none',
                    display: 'block'
                  }}
                  title="Invoice Preview"
                />
              ) : (
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight={800}
                  color="text.secondary"
                >
                  <Typography variant="h6">
                    Complete the form to generate preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item size={{ xs: 12 }}>
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
            sx={{ 
              '& .MuiAlert-icon': {
                color: 'success.main'
              }
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                100% Free - No Hidden Costs!
              </Typography>
              <Typography variant="body2">
                Download unlimited invoices without signing up. Create a free account to save your 
                invoices, send them by email, track payments, and access advanced features.
              </Typography>
            </Box>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderInvoiceForm();
      case 1:
        return renderPreview();
      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      <PublicInvoiceSEO />
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" gutterBottom align="center">
            Free Invoice Generator
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center">
            Create professional invoices in minutes - no signup required!
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Box sx={{ mt: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep === steps.length - 1 ? <DownloadIcon /> : (loadingPreview ? <CircularProgress size={20} color="inherit" /> : <PreviewIcon />)}
            size="large"
            disabled={loadingPreview || loadingDownload}
            sx={{
              background: activeStep === 0 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: activeStep === 0 ? '0 4px 14px 0 rgba(59, 130, 246, 0.3)' : '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: activeStep === 0 ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              },
              '&.Mui-disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            {activeStep === 0 ? (loadingPreview ? 'Generating Preview...' : 'Generate Preview') : 'Download Invoice'}
          </Button>
        </Box>

        {/* Signup Dialog */}
        <Dialog open={showSignupDialog} onClose={() => setShowSignupDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h5" component="div" align="center">
              Love what you see? 🎉
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box textAlign="center" py={2}>
              <Typography variant="body1" paragraph>
                Create a free account to unlock these features:
              </Typography>
              <Stack spacing={1} sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto', my: 3 }}>
                <Chip label="✓ Save unlimited invoices" color="primary" variant="outlined" />
                <Chip label="✓ Send invoices by email" color="primary" variant="outlined" />
                <Chip label="✓ Track payments" color="primary" variant="outlined" />
                <Chip label="✓ Manage customers" color="primary" variant="outlined" />
                <Chip label="✓ Recurring invoices" color="primary" variant="outlined" />
                <Chip label="✓ FlowBoost rewards" color="primary" variant="outlined" />
              </Stack>
              <Typography variant="h6" color="primary" gutterBottom>
                100% Free Forever - No Credit Card Required
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
            <Button onClick={() => setShowSignupDialog(false)} color="inherit">
              Maybe Later
            </Button>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              startIcon={<SaveIcon />}
            >
              Sign Up Free
            </Button>
          </DialogActions>
        </Dialog>

        {/* Template Selection Modal */}
        {renderTemplateSelectionModal()}
      </Container>

      {/* SEO Content Sections */}
      <Box sx={{ bgcolor: 'grey.50', py: 8, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
            Why Choose FlowDesk's Free Invoice Generator?
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  100% Free Forever
                </Typography>
                <Typography>
                  No hidden fees, no credit card required. Create unlimited professional invoices without any cost.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  17+ Templates
                </Typography>
                <Typography>
                  Choose from professionally designed templates for every business type and industry.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Instant PDF Download
                </Typography>
                <Typography>
                  Generate and download your invoices as PDF files instantly. No waiting, no email required.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* How It Works Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
              How to Create an Invoice in 3 Simple Steps
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" color="primary">1</Typography>
                  <Typography variant="h6" gutterBottom>Choose a Template</Typography>
                  <Typography color="text.secondary">
                    Select from our collection of professional invoice templates that suit your business style.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" color="primary">2</Typography>
                  <Typography variant="h6" gutterBottom>Fill in Details</Typography>
                  <Typography color="text.secondary">
                    Add your business info, customer details, and invoice items. All fields are customizable.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" color="primary">3</Typography>
                  <Typography variant="h6" gutterBottom>Download PDF</Typography>
                  <Typography color="text.secondary">
                    Preview and download your professional invoice as a PDF file. Send it to clients immediately.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* FAQ Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
              Frequently Asked Questions
            </Typography>
            
            <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Is the invoice generator really free?
                </Typography>
                <Typography color="text.secondary">
                  Yes! Our invoice generator is 100% free to use. No hidden fees, no credit card required. You can create and download unlimited invoices without signing up.
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  What invoice templates are available?
                </Typography>
                <Typography color="text.secondary">
                  We offer 17+ professionally designed invoice templates including Modern, Minimalist, Corporate, Creative, and more. All templates are customizable and free to use.
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Can I save my invoices without signing up?
                </Typography>
                <Typography color="text.secondary">
                  You can download your invoices as PDFs without signing up. To save invoices online and access them later, you'll need to create a free account.
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  What file format are invoices downloaded in?
                </Typography>
                <Typography color="text.secondary">
                  All invoices are downloaded as PDF files, which can be opened on any device and are perfect for sending to clients or printing.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default PublicInvoiceGenerator;
