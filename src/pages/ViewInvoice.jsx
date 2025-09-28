import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { downloadPdf } from '../utils/pdfUtils';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { invoiceAPI, customerAPI } from '../utils/api';
import SendInvoiceDialog from '../components/SendInvoiceDialog';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import RecurringInvoiceDialog from '../components/RecurringInvoiceDialog';
import { formatInvoiceNumber } from '../utils/formatters';
import { templates } from './InvoiceTemplates';

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, userData } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  // Check if send parameter is present and open send dialog
  useEffect(() => {
    if (searchParams.get('send') === 'true' && invoice && customer) {
      setSendDialogOpen(true);
    }
  }, [searchParams, invoice, customer]);

  const fetchInvoice = async () => {
    if (!currentUser || !id) return;

    try {
      setLoading(true);
      const response = await invoiceAPI.getById(id);
      const invoiceData = response.data;
      setInvoice(invoiceData);
      
      // Fetch customer data for sending emails
      if (invoiceData.customerId) {
        try {
          const customerResponse = await customerAPI.getById(invoiceData.customerId);
          setCustomer(customerResponse.data);
        } catch (error) {
          console.error('Error fetching customer:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.status === 404 
          ? 'Invoice not found' 
          : error.response?.data?.error || error.response?.data?.message || 'Failed to load invoice',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/invoices');
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadPDF = async () => {
    let loadingToast;
    try {
      loadingToast = toast.loading('Generating PDF...');
      
      // Generate PDF on-demand
      const response = await invoiceAPI.generatePdf(invoice.id);
      
      toast.dismiss(loadingToast);
      
      // Use common utility to open PDF
      const formattedNumber = formatInvoiceNumber(
        invoice.invoiceNumber,
        userData?.invoiceSettings?.prefix || 'INV'
      );
      downloadPdf(response.data?.pdf, `${formattedNumber}.pdf`);
    } catch (error) {
      if (loadingToast) toast.dismiss(loadingToast);
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to generate PDF',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice?.currency || 'USD',
    }).format(amount || 0);
  };

  const handleSendInvoice = async (sendData) => {
    try {
      const loadingToast = toast.loading('Sending invoice...');
      
      // Handle both old format (string) and new format (object with message and recipients)
      const payload = typeof sendData === 'string' 
        ? { customMessage: sendData } 
        : { 
            customMessage: sendData.message, 
            recipients: sendData.recipients 
          };
      
      const response = await invoiceAPI.send(id, payload);
      
      toast.dismiss(loadingToast);
      
      const recipientCount = sendData.recipients?.length || 1;
      toast.success(
        `Invoice sent successfully to ${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}!`
      );
      
      // Refresh invoice to get updated sent count
      fetchInvoice();
      
      return response.data;
    } catch (error) {
      toast.dismiss();
      console.error('Error sending invoice:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to send invoice. Please check your email configuration.';
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
      
      throw error;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 3 } }}>
      <Box sx={{ mb: 3, px: { xs: 2, sm: 0 } }}>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} flexWrap="wrap">
            <IconButton onClick={() => navigate('/invoices')} sx={{ mr: { xs: 0, sm: 1 } }}>
              <ArrowBackIcon />
            </IconButton>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={{ xs: 1, sm: 2 }}>
              <Typography variant={isMobile ? 'h5' : 'h4'}>
                Invoice #{formatInvoiceNumber(invoice.invoiceNumber, userData?.invoiceSettings?.prefix)}
              </Typography>
              <Chip
                label={invoice.status}
                color={getStatusColor(invoice.status)}
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          </Box>
          <Box display="flex" gap={{ xs: 1, sm: 2 }} flexWrap="wrap" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {!isMobile && (
              <Button
                variant="outlined"
                startIcon={<ScheduleIcon />}
                onClick={() => setRecurringDialogOpen(true)}
                disabled={!!invoice.recurringInvoiceId}
                title={invoice.recurringInvoiceId ? "This invoice was generated from a recurring template" : "Create recurring invoice from this template"}
              >
                Make Recurring
              </Button>
            )}
            <Button
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<PrintIcon />}
              onClick={handleDownloadPDF}
              sx={{ minWidth: { xs: 'auto', sm: 120 } }}
            >
              {isMobile ? 'PDF' : 'Download PDF'}
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<EmailIcon />}
              onClick={() => setSendDialogOpen(true)}
              color="primary"
              sx={{ minWidth: { xs: 'auto', sm: 120 } }}
            >
              {isMobile ? 'Send' : 'Send Invoice'}
            </Button>
            <Button
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<EditIcon />}
              onClick={() => navigate(`/invoices/${id}/edit`)}
              sx={{ minWidth: { xs: 'auto', sm: 120 } }}
            >
              {isMobile ? 'Edit' : 'Edit Invoice'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 8 }}>
          {/* Invoice Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Invoice Date
                </Typography>
                <Typography variant="body1">
                  {invoice.date && !isNaN(new Date(invoice.date).getTime()) 
                    ? format(new Date(invoice.date), 'MMMM dd, yyyy')
                    : 'Not set'
                  }
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Due Date
                </Typography>
                <Typography variant="body1">
                  {invoice.dueDate && !isNaN(new Date(invoice.dueDate).getTime())
                    ? format(new Date(invoice.dueDate), 'MMMM dd, yyyy')
                    : 'Not set'
                  }
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={invoice.status}
                  color={getStatusColor(invoice.status)}
                  size="small"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Payment Terms
                </Typography>
                <Typography variant="body1">
                  {invoice.paymentTerms}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Line Items */}
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Line Items
            </Typography>
            {isMobile ? (
              // Mobile Card View
              <Stack spacing={2}>
                {invoice.lineItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'grey.50'
                    }}
                  >
                    <Typography variant="body2" fontWeight="500" gutterBottom>
                      {item.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        {item.quantity} × {formatCurrency(item.rate)}
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatCurrency(item.amount)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              // Desktop Table View
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Rate</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice.lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.rate)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {invoice.notes && (
              <Box mt={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                  {invoice.notes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          {/* Customer Info */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Bill To:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {invoice.customerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.customerEmail}
            </Typography>
            {invoice.customerAddress?.street && (
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  {invoice.customerAddress.street}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {[
                    invoice.customerAddress.city,
                    invoice.customerAddress.state,
                    invoice.customerAddress.zipCode
                  ].filter(Boolean).join(', ')}
                </Typography>
                {invoice.customerAddress.country && (
                  <Typography variant="body2" color="text.secondary">
                    {invoice.customerAddress.country}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>

          {/* Template Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Template
            </Typography>
            {(() => {
              const templateId = invoice.templateId || 'default';
              const template = templates.find(t => t.id === templateId);
              const templateName = template ? template.name : 'Default';
              
              return (
                <Box>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      width: '100%',
                      paddingTop: '141.42%', // A4 aspect ratio (1:1.4142)
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      mb: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={handleDownloadPDF}
                    title="Click to download PDF"
                  >
                    <img 
                      src={`/template-previews/${templateId}-preview.png`}
                      alt={templateName}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        // Fallback to colored placeholder if image doesn't exist
                        const parent = e.target.parentElement;
                        parent.style.background = template?.preview?.primaryColor || '#f5f5f5';
                        parent.innerHTML = `
                          <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            text-align: center;
                            color: white;
                            padding: 20px;
                          ">
                            <h3 style="margin: 0 0 10px 0; font-size: 18px;">${templateName}</h3>
                            <p style="margin: 0; opacity: 0.8; font-size: 14px;">Template Preview</p>
                          </div>
                        `;
                      }}
                    />
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="subtitle1" fontWeight="500">
                      {templateName}
                    </Typography>
                    {template?.isPremium && (
                      <Chip 
                        label="Premium - Free for Early Adopters" 
                        size="small" 
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Click preview to download PDF
                    </Typography>
                  </Box>
                </Box>
              );
            })()}
          </Paper>

          {/* Invoice Summary */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Summary
            </Typography>
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatCurrency(invoice.subtotal)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Tax ({invoice.taxRate}%):</Typography>
                <Typography>{formatCurrency(invoice.taxAmount)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(invoice.total)}
                </Typography>
              </Box>
            </Box>

          </Paper>
        </Grid>
      </Grid>

      {/* Recurring Invoice Dialog */}
      {invoice && (
        <RecurringInvoiceDialog
          open={recurringDialogOpen}
          onClose={() => {
            setRecurringDialogOpen(false);
            // Navigate to recurring invoices page after creation
            navigate('/recurring-invoices');
          }}
          invoice={invoice}
          mode="create"
        />
      )}

      {/* Send Invoice Dialog */}
      {invoice && customer && (
        <SendInvoiceDialog
          open={sendDialogOpen}
          onClose={() => setSendDialogOpen(false)}
          invoice={{
            ...invoice,
            formattedInvoiceNumber: formatInvoiceNumber(
              invoice.invoiceNumber,
              userData?.profiles?.find(p => p.id === userData?.activeProfileId)?.invoiceSettings?.prefix || 
              userData?.invoiceSettings?.prefix || 
              'INV'
            ),
            userData: userData
          }}
          customer={customer}
          onSend={handleSendInvoice}
        />
      )}
    </Container>
  );
};

export default ViewInvoice;
