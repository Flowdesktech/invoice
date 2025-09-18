import React, { useState, useEffect } from 'react';
import CustomerDialog from '../components/CustomerDialog';
import RecurringInvoiceDialog from '../components/RecurringInvoiceDialog';
import currencyOptions from '../data/currencyOptions.json';
import { templates } from './InvoiceTemplates';
import Chip from '@mui/material/Chip';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Preview as PreviewIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Palette as PaletteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { customerAPI, invoiceAPI } from '../utils/api';
import { format, addDays, subDays, subWeeks, subMonths, subYears, getWeek, getQuarter } from 'date-fns';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { formatInvoiceNumber } from '../utils/formatters';

const CreateInvoice = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isEditMode = !!id;
  const isDuplicateMode = !!location.state?.duplicateData;
  const [customers, setCustomers] = useState([]);
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [setAsRecurring, setSetAsRecurring] = useState(false);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [customerEditMode, setCustomerEditMode] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { currentUser, userData, currentProfile } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customer: null,
      invoiceNumber: '',
      date: new Date(),
      dueDate: addDays(new Date(), (currentProfile || userData)?.invoiceSettings?.dueDateDuration || 7),
      status: 'draft',
      notes: '',
      taxRate: (currentProfile || userData)?.invoiceSettings?.taxRate || 0,
      paymentTerms: (currentProfile || userData)?.invoiceSettings?.paymentTerms || 'Due on receipt',
      currency: (currentProfile || userData)?.invoiceSettings?.currency || 'USD',
    }
  });

  const selectedCustomer = watch('customer');
  const taxRate = watch('taxRate');
  const currency = watch('currency');

  useEffect(() => {
    fetchCustomers();
    if (!isEditMode && !isDuplicateMode) {
      generateInvoiceNumber();
    }
  }, [currentUser, isEditMode, isDuplicateMode]);

  // Check for template ID in URL query parameters
  useEffect(() => {
    const templateId = searchParams.get('templateId');
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (isEditMode && customers.length > 0) {
      fetchInvoiceData();
    }
  }, [isEditMode, id, customers, searchParams]);


  // Handle duplicate data
  useEffect(() => {
    if (isDuplicateMode && customers.length > 0 && location.state?.duplicateData) {
      const duplicateData = location.state.duplicateData;
      
      // Find the customer object from the customers list
      const customer = customers.find(c => c.id === duplicateData.customerId);
      
      // Reset form with duplicate data
      reset({
        customer: customer || null,
        invoiceNumber: '', // Will be auto-generated
        date: new Date(duplicateData.date),
        dueDate: new Date(duplicateData.dueDate),
        status: 'draft', // Always start duplicates as draft
        notes: duplicateData.notes || '',
        taxRate: duplicateData.taxRate || 0,
        paymentTerms: duplicateData.paymentTerms || 'Due on receipt',
        currency: duplicateData.currency || (currentProfile || userData)?.invoiceSettings?.currency || 'USD',
      });
      
      // Set line items
      setLineItems(duplicateData.lineItems || [{ description: '', quantity: 1, rate: 0, amount: 0 }]);
      
      // Generate new invoice number for duplicate
      generateInvoiceNumber();
      
      // Show success message
      toast.success('Invoice duplicated successfully');
    }
  }, [isDuplicateMode, customers, location.state]);

  useEffect(() => {
    calculateTotals();
  }, [lineItems, taxRate]);

  const fetchInvoiceData = async () => {
    if (!currentUser || !id) return;

    try {
      setLoadingInvoice(true);
      const response = await invoiceAPI.getById(id);
      const invoice = response.data;
      
      // Find the customer object from the customers list
      const customer = customers.find(c => c.id === invoice.customerId);
      
      // Reset form with invoice data
      reset({
        customer: customer || null,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date ? new Date(invoice.date) : new Date(),
        dueDate: invoice.dueDate ? new Date(invoice.dueDate) : new Date(),
        status: invoice.status || 'draft',
        notes: invoice.notes || '',
        taxRate: invoice.taxRate || 0,
        paymentTerms: invoice.paymentTerms || 'Due on receipt',
        currency: invoice.currency || (currentProfile || userData)?.invoiceSettings?.currency || 'USD',
      });
      
      // Set line items
      setLineItems(invoice.lineItems || [{ description: '', quantity: 1, rate: 0, amount: 0 }]);
      
      // Restore selected template if available
      // Only set template from invoice data if there's no templateId in query params
      const queryTemplateId = searchParams.get('templateId');
      if (!queryTemplateId && invoice.templateId) {
        const template = templates.find(t => t.id === invoice.templateId);
        if (template) {
          setSelectedTemplate(template);
        }
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to load invoice data',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/invoices');
      });
    } finally {
      setLoadingInvoice(false);
    }
  };

  const fetchCustomers = async () => {
    if (!currentUser) return;

    try {
      setLoadingCustomers(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to load customers',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerCreated = (newCustomer) => {
    // Add the new customer to the list
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    // Select the new customer in the form
    setValue('customer', newCustomer);
  };

  const handleEditCustomer = () => {
    setCustomerToEdit(selectedCustomer);
    setCustomerEditMode(true);
    setCustomerDialogOpen(true);
  };

  const handleCustomerUpdated = (updatedCustomer) => {
    // Update the customer in the list
    setCustomers(prevCustomers => 
      prevCustomers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
    // Update the selected customer
    setValue('customer', updatedCustomer);
    // Reset edit mode
    setCustomerEditMode(false);
    setCustomerToEdit(null);
  };

  const handlePreview = async () => {
    try {
      setPreviewLoading(true);
      
      // Process line items to replace template placeholders
      const processedLineItems = lineItems
        .filter(item => item.description)
        .map(item => ({
          ...item,
          description: processTemplateDescription(item.description, watch('date'))
        }));
      
      // Prepare invoice data for preview
      const invoiceData = {
        customerId: selectedCustomer.id,
        invoiceNumber: watch('invoiceNumber'),
        date: new Date(watch('date')).getTime(),  // Convert to timestamp
        dueDate: new Date(watch('dueDate')).getTime(),  // Convert to timestamp
        lineItems: processedLineItems,
        taxRate: watch('taxRate') || 0,
        notes: processTemplateDescription(watch('notes'), watch('date')),
        paymentTerms: watch('paymentTerms'),
        status: watch('status') || 'draft',  // Include status for preview
        currency: watch('currency') || 'USD',  // Include currency for preview
        templateId: selectedTemplate?.id || null,  // Include template ID for preview
      };
      
      // Call backend preview API
      const response = await invoiceAPI.preview(invoiceData);
      setPreviewPdf(response.data.pdf);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to generate preview',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Process template placeholders in descriptions
  const processTemplateDescription = (description, invoiceDate) => {
    if (!description || !description.includes('{{')) {
      return description;
    }
    
    // Calculate period dates based on a monthly frequency (most common)
    const endDate = new Date(invoiceDate);
    const startDate = subMonths(endDate, 1);
    
    // Replace placeholders with actual dates
    let processed = description;
    
    // Date range placeholders
    processed = processed.replace(/\{\{PERIOD_START\}\}/gi, format(startDate, 'MMM d'));
    processed = processed.replace(/\{\{PERIOD_END\}\}/gi, format(endDate, 'MMM d'));
    
    // Month placeholders
    processed = processed.replace(/\{\{MONTH_NAME\}\}/gi, format(startDate, 'MMMM'));
    processed = processed.replace(/\{\{MONTH_SHORT\}\}/gi, format(startDate, 'MMM'));
    
    // Year and other placeholders
    processed = processed.replace(/\{\{YEAR\}\}/gi, format(startDate, 'yyyy'));
    processed = processed.replace(/\{\{WEEK_NUMBER\}\}/gi, getWeek(endDate).toString());
    processed = processed.replace(/\{\{QUARTER\}\}/gi, getQuarter(startDate).toString());
    
    return processed;
  };

  const generateInvoiceNumber = async () => {
    if (!userData?.invoiceSettings) return;

    const { nextNumber } = userData.invoiceSettings;
    // Store only the number in the form
    setValue('invoiceNumber', nextNumber);
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleRemoveLineItem = (index) => {
    if (lineItems.length > 1) {
      const newItems = lineItems.filter((_, i) => i !== index);
      setLineItems(newItems);
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const rate = field === 'rate' ? value : newItems[index].rate;
      newItems[index].amount = quantity * rate;
    }

    setLineItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    return { subtotal, taxAmount, total };
  };

  const onSubmit = async (data) => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (lineItems.every(item => !item.description || item.amount === 0)) {
      toast.error('Please add at least one line item');
      return;
    }

    try {
      setLoading(true);

      // Process line items to replace template placeholders
      const processedLineItems = lineItems
        .filter(item => item.description && item.amount > 0)
        .map(item => ({
          ...item,
          description: processTemplateDescription(item.description, data.date)
        }));
      
      // Prepare invoice data for API
      const invoiceData = {
        customerId: selectedCustomer.id,
        lineItems: processedLineItems,
        taxRate: data.taxRate,
        notes: processTemplateDescription(data.notes, data.date),
        paymentTerms: data.paymentTerms,
        date: new Date(data.date).getTime(),  // Convert to Date object then timestamp
        dueDate: new Date(data.dueDate).getTime(),  // Convert to Date object then timestamp
        status: data.status,
        invoiceNumber: data.invoiceNumber, // Always include invoice number
        currency: data.currency, // Include currency for invoice
        templateId: selectedTemplate?.id || null, // Only send template ID
      };

      if (isEditMode) {
        // Update existing invoice
        await invoiceAPI.update(id, invoiceData);
        toast.success('Invoice updated successfully!');
      } else {
        // Create new invoice
        const response = await invoiceAPI.create(invoiceData);
        toast.success('Invoice created successfully with PDF!');
        
        // If set as recurring is checked, open the recurring dialog
        if (setAsRecurring) {
          // Validate the response contains valid invoice data
          if (!response.data || typeof response.data === 'string' || response.data.toString().includes('<!DOCTYPE')) {
            console.error('Invalid invoice data received:', response.data);
            toast.error('Error: Invalid response from server. Please try again.');
            navigate('/invoices');
            return;
          }
          
          // Ensure we have the complete invoice data including lineItems from our local state
          const completeInvoiceData = {
            ...response.data,
            lineItems: lineItems.filter(item => item.description && item.amount > 0),
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            customerEmail: selectedCustomer.email,
            taxRate: data.taxRate,
            notes: data.notes,
            paymentTerms: data.paymentTerms
          };
          
          setCreatedInvoice(completeInvoiceData);
          setRecurringDialogOpen(true);
        } else {
          navigate(`/invoices/${response.data.id}`);
        }
        return;
      }
      
      // For edit mode, navigate back to invoice view
      navigate(`/invoices/${id}`);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} invoice:`, error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} invoice`,
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  if (loadingCustomers || loadingInvoice) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <CircularProgress size={48} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            {loadingInvoice ? 'Loading invoice...' : 'Loading customers...'}
          </Typography>
        </Box>
      </Box>
    );
  }

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <Container maxWidth="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ 
          mb: { xs: 3, sm: 4 },
          px: { xs: 0, sm: 2, md: 3 }
        }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              color: 'text.primary',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            {isEditMode ? 'Edit Invoice' : 'Create Invoice'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditMode ? 'Update the invoice details below' : 'Fill in the details below to create a new invoice'}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Customer and Invoice Details */}
          <Grid size={{ xs: 12, md: 12, lg: 8, xl: 9 }}>
            {/* Template Selection */}
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                background: selectedTemplate ? 'linear-gradient(to right, #f3f4f6, #ffffff)' : 'transparent',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Template Preview Thumbnail */}
                  {selectedTemplate && (
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
                        src={`/template-previews/${selectedTemplate.id}-preview.png`}
                        alt={`${selectedTemplate.name} preview`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.style.background = selectedTemplate.preview.primaryColor;
                          e.target.parentNode.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 14px; text-align: center; padding: 10px;">${selectedTemplate.name}</div>`;
                        }}
                      />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Invoice Template
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTemplate 
                        ? `${selectedTemplate.name} - ${selectedTemplate.description}`
                        : 'Using default template'
                      }
                    </Typography>
                    {selectedTemplate?.isPremium && (
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
                <Button
                  variant="outlined"
                  startIcon={<PaletteIcon />}
                  onClick={() => {
                    // Construct the return path with current query params preserved
                    let returnPath = isEditMode ? `/invoices/${id}/edit` : '/invoices/create';
                    
                    // Preserve existing query parameters (except templateId which will be updated)
                    const currentParams = new URLSearchParams(window.location.search);
                    currentParams.delete('templateId'); // Remove old templateId if exists
                    
                    if (currentParams.toString()) {
                      returnPath += '?' + currentParams.toString();
                    }
                    
                    navigate('/invoice-templates', { state: { returnPath } });
                  }}
                  sx={{ minWidth: 150 }}
                >
                  {selectedTemplate ? 'Change Template' : 'Choose Template'}
                </Button>
              </Box>
            </Paper>

            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                Customer Selection
              </Typography>
              
              {/* Customer Selection - Separate Section */}
              <Box sx={{ mb: 4 }}>
                <Controller
                  name="customer"
                    control={control}
                    rules={{ required: 'Customer is required' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={[{ id: 'new', name: '+ Add New Customer' }, ...customers]}
                        getOptionLabel={(option) => option.name || ''}
                        renderOption={(props, option) => {
                          const { key, ...otherProps } = props;
                          return (
                            <Box
                              component="li"
                              key={key}
                              {...otherProps}
                              sx={{
                                fontWeight: option.id === 'new' ? 600 : 400,
                                color: option.id === 'new' ? 'primary.main' : 'inherit',
                                borderBottom: option.id === 'new' ? '1px solid' : 'none',
                                borderColor: 'divider',
                                '&:hover': {
                                  backgroundColor: option.id === 'new' ? 'primary.50' : 'action.hover',
                                },
                              }}
                            >
                              {option.id === 'new' && <AddIcon sx={{ mr: 1, fontSize: 20 }} />}
                              {option.name}
                            </Box>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Customer *"
                            error={!!errors.customer}
                            helperText={errors.customer?.message}
                            fullWidth
                          />
                        )}
                        onChange={(_, value) => {
                          if (value?.id === 'new') {
                            setCustomerDialogOpen(true);
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    )}
                  />
              </Box>
                
              {/* Customer Information Display */}
              {selectedCustomer && (
                <Box sx={{ mb: 4 }}>
                    <Paper
                      sx={{
                        p: { xs: 2, sm: 3 },
                        backgroundColor: '#f8fafc',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                          Customer Details
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={handleEditCustomer}
                          sx={{ textTransform: 'none' }}
                        >
                          Edit Customer
                        </Button>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <BusinessIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Name
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedCustomer.name}
                          </Typography>
                          {selectedCustomer.company && (
                            <Typography variant="body2" color="text.secondary">
                              {selectedCustomer.company}
                            </Typography>
                          )}
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Contact
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {selectedCustomer.email}
                          </Typography>
                          {selectedCustomer.phone && (
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {selectedCustomer.phone}
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                        
                        {selectedCustomer.address && (
                          <Grid size={12}>
                            <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                              <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                              <Box>
                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                  Address
                                </Typography>
                                {selectedCustomer.address.street && (
                                  <Typography variant="body2">
                                    {selectedCustomer.address.street}
                                  </Typography>
                                )}
                                {(selectedCustomer.address.city || selectedCustomer.address.state || selectedCustomer.address.zipCode) && (
                                  <Typography variant="body2">
                                    {[
                                      selectedCustomer.address.city,
                                      selectedCustomer.address.state,
                                      selectedCustomer.address.zipCode
                                    ].filter(Boolean).join(', ')}
                                  </Typography>
                                )}
                                {selectedCustomer.address.country && (
                                  <Typography variant="body2">
                                    {selectedCustomer.address.country}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                </Box>
              )}
              
              {/* Invoice Details Section */}
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                Invoice Details
              </Typography>
              
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Invoice Details Row */}
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 2 }}>
                  <Controller
                    name="invoiceNumber"
                    control={control}
                    render={({ field }) => {
                      const profileData = currentProfile || userData;
                      const autoIncrement = profileData?.invoiceSettings?.autoIncrementNumber !== false;
                      const prefix = profileData?.invoiceSettings?.prefix || 'INV';
                      const nextNumber = profileData?.invoiceSettings?.nextNumber || 1;
                      
                      // Display only the number without prefix
                      const displayValue = field.value || '';
                      const nextInvoiceNumberFormatted = formatInvoiceNumber(nextNumber, prefix);
                      
                      return (
                        <TextField
                          {...field}
                          value={displayValue}
                          onChange={(e) => {
                            // Only allow numbers
                            const numberOnly = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(numberOnly ? parseInt(numberOnly, 10) : '');
                          }}
                          label="Invoice #"
                          type="text"
                          fullWidth
                          size="medium"
                          disabled={false}
                          placeholder={!isEditMode && autoIncrement ? String(nextNumber) : ''}
                          helperText={
                            isEditMode 
                              ? "Update invoice number" 
                              : autoIncrement 
                                ? `Will be saved as: ${nextInvoiceNumberFormatted}`
                                : "Enter invoice number"
                          }
                          inputProps={{ 
                            style: { textAlign: 'right' }
                          }}
                          sx={{
                            '& .MuiFormHelperText-root': {
                              fontSize: '0.7rem',
                              color: 'text.secondary',
                            },
                            '& .Mui-disabled': {
                              color: 'text.primary',
                              WebkitTextFillColor: 'currentcolor',
                            }
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => {
                      const profileData = currentProfile || userData;
                      const dueDateDuration = profileData?.invoiceSettings?.dueDateDuration || 7;
                      
                      return (
                        <DatePicker
                          label="Invoice Date *"
                          value={field.value}
                          onChange={(newDate) => {
                            field.onChange(newDate);
                            // Automatically update due date based on profile settings
                            if (newDate) {
                              const newDueDate = addDays(newDate, dueDateDuration);
                              setValue('dueDate', newDueDate);
                            }
                          }}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Due Date *"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value="draft">Draft</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Line Items */}
            <Paper sx={{ 
              p: { xs: 2, sm: 3 },
              overflow: 'hidden'
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Line Items
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddLineItem}
                  size="small"
                >
                  Add Item
                </Button>
              </Box>
              
              <TableContainer sx={{ 
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: 4,
                },
              }}>
                <Table sx={{ minWidth: { xs: 600, sm: 700 } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Description</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' }, width: { xs: 80, sm: 100 } }}>Qty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' }, width: { xs: 100, sm: 120 } }}>Rate</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' }, width: { xs: 100, sm: 120 } }}>Amount</TableCell>
                      <TableCell sx={{ width: 50 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 1 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={item.rate}
                            onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveLineItem(index)}
                            disabled={lineItems.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={4}>
                <Divider sx={{ mb: 3 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 2 
                  }}
                >
                  Additional Information
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 3 }} style={{width: '100%'}}>
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Notes & Terms"
                          multiline
                          rows={4}
                          fullWidth
                          placeholder="Enter any additional notes, terms, or special instructions for this invoice"
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f8fafc',
                              '&:hover': {
                                backgroundColor: '#f1f5f9',
                              },
                              '&.Mui-focused': {
                                backgroundColor: '#ffffff',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontWeight: 500,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Summary and Actions */}
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }} sx={{ 
            order: { xs: -1, sm: -1, md: 2, lg: 2 } 
          }}>
            <Box sx={{ 
              position: { lg: 'sticky' }, 
              top: { lg: 20 }
            }}>
              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 2.5, md: 3 }, 
                  mb: { xs: 2, sm: 3 },
                  borderRadius: { xs: 1, sm: 2 },
                  border: '1px solid',
                  borderColor: 'divider',
                  background: { 
                    xs: '#ffffff',
                    sm: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    mb: { xs: 2, sm: 3 },
                    pb: { xs: 1.5, sm: 2 },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Invoice Summary
                </Typography>
              
                {selectedCustomer && (
                  <Box 
                    mb={{ xs: 2, sm: 3 }} 
                    sx={{ 
                      p: { xs: 1, sm: 1.5, md: 2 }, 
                      backgroundColor: '#f8fafc',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Bill To:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      {selectedCustomer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.7rem', sm: '0.875rem' }
                    }}>
                      {selectedCustomer.email}
                    </Typography>
                    {selectedCustomer.address?.street && (
                      <>
                        <Typography variant="body2">{selectedCustomer.address.street}</Typography>
                        <Typography variant="body2">
                          {[
                            selectedCustomer.address.city,
                            selectedCustomer.address.state,
                            selectedCustomer.address.zipCode
                          ].filter(Boolean).join(', ')}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}

              <Divider sx={{ my: { xs: 1.5, sm: 2 }, display: { xs: 'none', sm: 'block' } }} />

              <Grid container spacing={2} mb={{ xs: 2, sm: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Currency</InputLabel>
                        <Select
                          {...field}
                          label="Currency"
                          sx={{
                            '& .MuiInputBase-root': {
                              backgroundColor: '#ffffff',
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }
                          }}
                        >
                          {currencyOptions.map((currencyOption) => (
                            <MenuItem key={currencyOption.value} value={currencyOption.value}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {currencyOption.symbol}
                                </Typography>
                                <Typography variant="body2">
                                  {currencyOption.label}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="taxRate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tax Rate (%)"
                        type="number"
                        size="small"
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: '#ffffff',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box mb={3}>
                <Controller
                  name="paymentTerms"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Payment Terms"
                      size="small"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: '#ffffff',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                    />
                  )}
                />
              </Box>

                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 2, md: 3 }, 
                    backgroundColor: '#f1f5f9',
                    borderRadius: { xs: 1, sm: 2 },
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: { xs: 2, sm: 3 }
                  }}
                >
                <Box display="flex" justifyContent="space-between" mb={{ xs: 1, sm: 2 }}>
                  <Typography variant="body1" color="text.secondary" sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={{ xs: 1, sm: 2 }}>
                  <Typography variant="body1" color="text.secondary" sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Tax ({taxRate || 0}%)
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    {formatCurrency(taxAmount)}
                  </Typography>
                </Box>
                <Divider sx={{ my: { xs: 1.5, sm: 2 }, borderColor: 'divider' }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={600} sx={{
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Total Due
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight={700}
                    sx={{ 
                      color: 'primary.main',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' }
                    }}
                  >
                    {formatCurrency(total)}
                  </Typography>
                </Box>
              </Box>

                <Box display="flex" flexDirection="column" gap={{ xs: 1, sm: 1.5, md: 2 }}>
                {!isEditMode && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={setAsRecurring}
                        onChange={(e) => setSetAsRecurring(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Set as recurring invoice"
                    sx={{
                      mb: 1,
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 500
                      }
                    }}
                  />
                )}
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<PreviewIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                  onClick={handlePreview}
                  disabled={!selectedCustomer || lineItems.every(item => !item.description) || previewLoading}
                  sx={{
                    py: { xs: 1, sm: 1.5 },
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    borderWidth: { xs: 1, sm: 2 },
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': {
                      borderWidth: { xs: 1, sm: 2 },
                      borderColor: 'secondary.dark',
                      backgroundColor: 'secondary.50',
                    },
                    '&.Mui-disabled': {
                      borderWidth: { xs: 1, sm: 2 },
                    }
                  }}
                >
                  {previewLoading ? 'Generating...' : 'Preview Invoice'}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={loading ? null : <SaveIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                  disabled={loading}
                  sx={{
                    py: { xs: 1, sm: 1.5 },
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    boxShadow: { xs: 1, sm: 2 },
                    '&:hover': {
                      boxShadow: { xs: 2, sm: 4 },
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update Invoice' : 'Create Invoice')}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="medium"
                  startIcon={<CancelIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                  onClick={() => navigate('/invoices')}
                  disabled={loading}
                  sx={{
                    py: { xs: 0.75, sm: 1 },
                    textTransform: 'none',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    borderWidth: { xs: 1, sm: 2 },
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                      borderWidth: { xs: 1, sm: 2 },
                      borderColor: 'text.secondary',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      {/* Customer Dialog */}
      <CustomerDialog
        open={customerDialogOpen}
        onClose={() => {
          setCustomerDialogOpen(false);
          setCustomerEditMode(false);
          setCustomerToEdit(null);
        }}
        onCustomerCreated={handleCustomerCreated}
        onCustomerUpdated={handleCustomerUpdated}
        customer={customerToEdit}
        editMode={customerEditMode}
      />
      
      {/* Invoice Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Invoice Preview
          </Typography>
          <Box>
            <IconButton
              onClick={() => window.print()}
              sx={{ mr: 1 }}
            >
              <PrintIcon />
            </IconButton>
            <IconButton
              onClick={() => setPreviewOpen(false)}
              edge="end"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {/* PDF Preview */}
          {previewPdf ? (
            <iframe
              src={`data:application/pdf;base64,${previewPdf}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Invoice Preview"
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: '#f5f5f5',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Recurring Invoice Dialog */}
      {createdInvoice && (
        <RecurringInvoiceDialog
          open={recurringDialogOpen}
          onClose={() => {
            setRecurringDialogOpen(false);
            navigate(`/invoices/${createdInvoice.id}`);
          }}
          invoiceData={{
            ...createdInvoice,
            startDate: createdInvoice.date // Use invoice date as start date
          }}
          onSuccess={() => {
            setRecurringDialogOpen(false);
            navigate('/recurring-invoices');
          }}
        />
      )}
    </Container>
  );
};

export default CreateInvoice;
