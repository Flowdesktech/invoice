import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, isAfter } from 'date-fns';
import { recurringInvoiceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RecurringInvoiceDialog from '../components/RecurringInvoiceDialog';

const RecurringInvoices = () => {
  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecurring, setSelectedRecurring] = useState(null);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [pauseUntilDate, setPauseUntilDate] = useState(new Date());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  const fetchRecurringInvoices = async () => {
    try {
      setLoading(true);
      const response = await recurringInvoiceAPI.getAll();
      setRecurringInvoices(response.data);
    } catch (error) {
      toast.error('Failed to fetch recurring invoices');
      console.error('Error fetching recurring invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, recurringInvoice) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecurring(recurringInvoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecurring(null);
  };

  const handlePauseClick = () => {
    setPauseDialogOpen(true);
    handleMenuClose();
  };

  const handlePauseConfirm = async () => {
    try {
      await recurringInvoiceAPI.pause(selectedRecurring.id, pauseUntilDate);
      toast.success('Recurring invoice paused');
      fetchRecurringInvoices();
      setPauseDialogOpen(false);
    } catch (error) {
      toast.error('Failed to pause recurring invoice');
      console.error('Error pausing recurring invoice:', error);
    }
  };

  const handleResume = async (recurringInvoice) => {
    try {
      await recurringInvoiceAPI.resume(recurringInvoice.id);
      toast.success('Recurring invoice resumed');
      fetchRecurringInvoices();
    } catch (error) {
      toast.error('Failed to resume recurring invoice');
      console.error('Error resuming recurring invoice:', error);
    }
  };

  const handleStop = async () => {
    try {
      if (window.confirm('Are you sure you want to stop this recurring invoice? This action cannot be undone.')) {
        await recurringInvoiceAPI.stop(selectedRecurring.id);
        toast.success('Recurring invoice stopped');
        fetchRecurringInvoices();
      }
    } catch (error) {
      toast.error('Failed to stop recurring invoice');
      console.error('Error stopping recurring invoice:', error);
    } finally {
      handleMenuClose();
    }
  };

  const handleGenerateNext = async (recurringInvoice) => {
    try {
      setGeneratingInvoice(recurringInvoice.id);
      const response = await recurringInvoiceAPI.generateNext(recurringInvoice.id);
      toast.success('Invoice generated successfully');
      
      // Navigate to the newly created invoice
      if (response.data?.invoice?.id) {
        navigate(`/invoices/${response.data.invoice.id}`);
      }
    } catch (error) {
      toast.error('Failed to generate invoice');
      console.error('Error generating invoice:', error);
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const handleViewInvoices = (recurringInvoice) => {
    navigate(`/recurring-invoices/${recurringInvoice.id}/invoices`);
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return labels[frequency] || frequency;
  };

  const getStatusChip = (recurringInvoice) => {
    if (!recurringInvoice.isActive) {
      if (recurringInvoice.pausedUntil && recurringInvoice.pausedUntil > Date.now()) {
        return (
          <Chip
            label={`Paused until ${format(new Date(recurringInvoice.pausedUntil), 'MMM dd, yyyy')}`}
            color="warning"
            size="small"
          />
        );
      }
      return <Chip label="Paused" color="warning" size="small" />;
    }
    
    if (recurringInvoice.endDate && new Date(recurringInvoice.endDate) < new Date()) {
      return <Chip label="Ended" color="default" size="small" />;
    }
    
    return <Chip label="Active" color="success" size="small" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const calculateInvoiceTotal = (recurringInvoice) => {
    const subtotal = recurringInvoice.lineItems?.reduce((sum, item) => sum + (item.quantity * item.rate), 0) || 0;
    const taxAmount = (subtotal * (recurringInvoice.taxRate || 0)) / 100;
    return subtotal + taxAmount;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* React 19 SEO Meta Tags */}
      <title>Recurring Invoices - FlowDesk Invoice Management</title>
      <meta name="description" content="Manage recurring invoices with automated scheduling. Set up weekly, monthly, or custom billing cycles. Track and control recurring revenue streams." />
      
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">
              Recurring Invoices
            </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/invoices')}
          >
            Create from Invoice
          </Button>
        </Box>

        {recurringInvoices.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No recurring invoices yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Create recurring invoices from your existing invoices to automate your billing.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/invoices')}
              sx={{ mt: 2 }}
            >
              Go to Invoices
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Next Invoice</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Generated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recurringInvoices.map((recurringInvoice) => (
                  <TableRow key={recurringInvoice.id} hover>
                    <TableCell>{recurringInvoice.customerName}</TableCell>
                    <TableCell>{formatCurrency(calculateInvoiceTotal(recurringInvoice))}</TableCell>
                    <TableCell>{getFrequencyLabel(recurringInvoice.frequency)}</TableCell>
                    <TableCell>
                      {recurringInvoice.isActive && recurringInvoice.nextGenerationDate
                        ? format(new Date(recurringInvoice.nextGenerationDate), 'MMM dd, yyyy')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>{getStatusChip(recurringInvoice)}</TableCell>
                    <TableCell>{recurringInvoice.totalGenerated || 0}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        {recurringInvoice.isActive && (
                          <Tooltip title="Generate Next Invoice">
                            <IconButton
                              size="small"
                              onClick={() => handleGenerateNext(recurringInvoice)}
                              disabled={generatingInvoice === recurringInvoice.id}
                            >
                              {generatingInvoice === recurringInvoice.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <RefreshIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {!recurringInvoice.isActive && recurringInvoice.pausedUntil && (
                          <Tooltip title="Resume">
                            <IconButton
                              size="small"
                              onClick={() => handleResume(recurringInvoice)}
                            >
                              <PlayIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="View Generated Invoices">
                          <IconButton
                            size="small"
                            onClick={() => handleViewInvoices(recurringInvoice)}
                          >
                            <ReceiptIcon />
                          </IconButton>
                        </Tooltip>

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, recurringInvoice)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { setEditDialogOpen(true); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {selectedRecurring?.isActive && (
          <MenuItem onClick={handlePauseClick}>
            <PauseIcon fontSize="small" sx={{ mr: 1 }} />
            Pause
          </MenuItem>
        )}
        <MenuItem onClick={handleStop} sx={{ color: 'error.main' }}>
          <StopIcon fontSize="small" sx={{ mr: 1 }} />
          Stop Recurring
        </MenuItem>
      </Menu>

      {/* Pause Dialog */}
      <Dialog open={pauseDialogOpen} onClose={() => setPauseDialogOpen(false)}>
        <DialogTitle>Pause Recurring Invoice</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DatePicker
              label="Pause Until"
              value={pauseUntilDate}
              onChange={(newValue) => setPauseUntilDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={new Date()}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPauseDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePauseConfirm} variant="contained">
            Pause
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      {selectedRecurring && (
        <RecurringInvoiceDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            fetchRecurringInvoices();
          }}
          recurringInvoice={selectedRecurring}
          mode="edit"
        />
      )}
    </Container>
    </>
  );
};

export default RecurringInvoices;
