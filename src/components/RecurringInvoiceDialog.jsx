import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { recurringInvoiceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { addDays } from 'date-fns';

const RecurringInvoiceDialog = ({ open, onClose, invoice, invoiceData, recurringInvoice, mode = 'create', onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      frequency: 'monthly',
      startDate: new Date(),
      endDate: null,
      notes: '',
    },
  });

  const frequency = watch('frequency');

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && recurringInvoice) {
        // Edit mode - populate with existing recurring invoice data
        reset({
          frequency: recurringInvoice.frequency,
          startDate: new Date(recurringInvoice.startDate),
          endDate: recurringInvoice.endDate ? new Date(recurringInvoice.endDate) : null,
          notes: recurringInvoice.notes || '',
        });
      } else if (mode === 'create') {
        // Create mode - use invoiceData if provided (from CreateInvoice), otherwise use invoice
        const invoiceToUse = invoiceData || invoice;
        reset({
          frequency: 'monthly',
          startDate: invoiceToUse?.startDate ? new Date(invoiceToUse.startDate) : new Date(),
          endDate: null,
          notes: invoiceToUse?.notes || '',
        });
      }
    }
  }, [open, mode, recurringInvoice, invoice, invoiceData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      if (mode === 'edit') {
        // Update existing recurring invoice
        await recurringInvoiceAPI.update(recurringInvoice.id, {
          frequency: data.frequency,
          startDate: data.startDate?.valueOf(),
          endDate: data.endDate?.valueOf(),
          notes: data.notes,
        });
        toast.success('Recurring invoice updated successfully');
      } else {
        // Create new recurring invoice
        const invoiceToUse = invoiceData || invoice;
        const recurringData = {
          fromInvoiceId: invoiceToUse?.id,
          frequency: data.frequency,
          startDate: data.startDate?.valueOf(),
          endDate: data.endDate?.valueOf(),
          notes: data.notes,
          // Include invoice data if creating from invoice
          customerId: invoiceToUse?.customerId,
          customerName: invoiceToUse?.customerName,
          customerEmail: invoiceToUse?.customerEmail,
          lineItems: invoiceToUse?.lineItems,
          taxRate: invoiceToUse?.taxRate,
          paymentTerms: invoiceToUse?.paymentTerms,
        };
        
        await recurringInvoiceAPI.create(recurringData);
        toast.success('Recurring invoice created successfully');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        handleClose();
      }
    } catch (error) {
      console.error('Error saving recurring invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to save recurring invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const getFrequencyHelperText = () => {
    const texts = {
      weekly: 'Invoice will be generated every week',
      biweekly: 'Invoice will be generated every two weeks',
      monthly: 'Invoice will be generated on the same day each month',
      quarterly: 'Invoice will be generated every 3 months',
      yearly: 'Invoice will be generated on the same date each year',
    };
    return texts[frequency] || '';
  };

  const getTemplateExample = () => {
    const examples = {
      weekly: (
        <Box>
          <Typography variant="body2">
            <strong>Description template:</strong> {`"Software Development (\{\{PERIOD_START\}\} - \{\{PERIOD_END\}\})"`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Will generate:</strong> "Software Development (Sep 8 - Sep 14)"
          </Typography>
        </Box>
      ),
      biweekly: (
        <Box>
          <Typography variant="body2">
            <strong>Description template:</strong> {`"Consulting Services (\{\{PERIOD_START\}\} - \{\{PERIOD_END\}\})"`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Will generate:</strong> "Consulting Services (Sep 1 - Sep 14)"
          </Typography>
        </Box>
      ),
      monthly: (
        <Box>
          <Typography variant="body2">
            <strong>Description template:</strong> {`"Software Development for \{\{MONTH_NAME\}\}"`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Will generate:</strong> "Software Development for August"
          </Typography>
        </Box>
      ),
      quarterly: (
        <Box>
          <Typography variant="body2">
            <strong>Description template:</strong> {`"Q\{\{QUARTER\}\} \{\{YEAR\}\} Services"`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Will generate:</strong> "Q3 2025 Services"
          </Typography>
        </Box>
      ),
      yearly: (
        <Box>
          <Typography variant="body2">
            <strong>Description template:</strong> {`"Annual Support \{\{YEAR\}\}"`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Will generate:</strong> "Annual Support 2025"
          </Typography>
        </Box>
      ),
    };
    return examples[frequency] || null;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon color="primary" />
            <Typography variant="body1" component="div" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
              {mode === 'edit' ? 'Edit Recurring Invoice' : 'Create Recurring Invoice'}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {mode === 'create' && invoice && (
              <Grid item size={12}>
                <Alert severity="info">
                  Creating recurring invoice from: <strong>{invoice.invoiceNumber}</strong> - {invoice.customerName}
                </Alert>
              </Grid>
            )}
            
            <Grid item size={12}>
              <Controller
                name="frequency"
                control={control}
                rules={{ required: 'Frequency is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.frequency}>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      {...field}
                      label="Frequency"
                    >
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="biweekly">Bi-weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="quarterly">Quarterly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {getFrequencyHelperText()}
              </Typography>
            </Grid>
            
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: 'Start date is required' }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Start Date"
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        error={!!errors.startDate}
                        helperText={errors.startDate?.message || 'When to start generating invoices'}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="End Date (Optional)"
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        helperText="Leave empty for indefinite recurrence"
                      />
                    )}
                    minDate={watch('startDate')}
                  />
                )}
              />
            </Grid>
            
            <Grid item size={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes (Optional)"
                    fullWidth
                    multiline
                    rows={3}
                    helperText="These notes will be included in all generated invoices"
                  />
                )}
              />
            </Grid>
            
            {mode === 'create' && (
              <>
                <Grid item size={12}>
                  <Alert severity="info">
                    <Typography variant="body2" gutterBottom>
                      <strong>Dynamic Description Templates</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Use placeholders in line item descriptions to automatically update dates:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      <li><code>{'{{PERIOD_START}}'}</code> - Start date (e.g., "Sep 8")</li>
                      <li><code>{'{{PERIOD_END}}'}</code> - End date (e.g., "Sep 14")</li>
                      <li><code>{'{{MONTH_NAME}}'}</code> - Full month name (e.g., "August")</li>
                      <li><code>{'{{MONTH_SHORT}}'}</code> - Short month (e.g., "Aug")</li>
                      <li><code>{'{{YEAR}}'}</code> - Year (e.g., "2025")</li>
                    </Box>
                  </Alert>
                </Grid>
                
                <Grid item size={12}>
                  <Alert severity="success">
                    <Typography variant="body2" gutterBottom>
                      <strong>Example for {frequency} invoices:</strong>
                    </Typography>
                    {getTemplateExample()}
                  </Alert>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create Recurring Invoice')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RecurringInvoiceDialog;
