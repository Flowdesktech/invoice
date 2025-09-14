import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { invoiceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    if (!currentUser || !id) return;

    try {
      setLoading(true);
      const response = await invoiceAPI.getById(id);
      setInvoice(response.data);
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
    try {
      const loadingToast = toast.loading('Generating PDF...');
      
      // Generate PDF on-demand
      const response = await invoiceAPI.generatePdf(invoice.id);
      
      toast.dismiss(loadingToast);
      
      if (response.data?.pdf) {
        // Convert base64 to blob and create download link
        const base64Data = response.data.pdf;
        const byteCharacters = atob(base64Data.replace(/^data:application\/pdf;base64,/, ''));
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Clean up
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        
        toast.success('PDF generated successfully!');
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (error) {
      toast.dismiss();
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
      currency: 'USD',
    }).format(amount || 0);
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
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate('/invoices')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">
              Invoice #{invoice.invoiceNumber}
            </Typography>
            <Chip
              label={invoice.status}
              color={getStatusColor(invoice.status)}
              size="medium"
            />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/invoices/${id}/edit`)}
            >
              Edit Invoice
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Invoice Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={invoice.status}
                  color={getStatusColor(invoice.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Line Items
            </Typography>
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

        <Grid item xs={12} md={4}>
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
    </Container>
  );
};

export default ViewInvoice;
