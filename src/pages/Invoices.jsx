import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  InputBase,
  alpha,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Checkbox,
  Toolbar,
  Tooltip,
  Skeleton,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  GetApp as DownloadIcon,
  FilterList as FilterIcon,
  FileCopy as FileCopyIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { invoiceAPI } from '../utils/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { formatInvoiceNumber } from '../utils/formatters';
import { templates } from './InvoiceTemplates';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, [currentUser]);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, statusFilter, invoices]);

  const fetchInvoices = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await invoiceAPI.getAll();
      const invoicesData = response.data;

      setInvoices(invoicesData);
      setFilteredInvoices(invoicesData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to load invoices',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          formatInvoiceNumber(invoice.invoiceNumber, userData?.invoiceSettings?.prefix)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
    setPage(0);
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await invoiceAPI.updateStatus(invoiceId, newStatus);
      toast.success('Invoice status updated');
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to update invoice status',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    const result = await Swal.fire({
      title: 'Delete Invoice?',
      text: 'Are you sure you want to delete this invoice? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await invoiceAPI.delete(invoiceId);
        Swal.fire({
          title: 'Deleted!',
          text: 'Invoice has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.error || error.response?.data?.message || 'Failed to delete invoice',
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const handleDuplicateInvoice = (invoice) => {
    // Calculate new dates
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    
    // Prepare duplicate data
    const duplicateData = {
      customerId: invoice.customerId,
      lineItems: invoice.lineItems,
      taxRate: invoice.taxRate,
      notes: invoice.notes,
      paymentTerms: invoice.paymentTerms,
      date: currentDate.getTime(),
      dueDate: dueDate.getTime(),
      isDuplicate: true
    };
    
    // Navigate to create page with duplicate data
    navigate('/invoices/create', { state: { duplicateData } });
  };

  const handleDownloadInvoice = async (invoice) => {
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

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredInvoices.map(invoice => invoice.id);
      setSelectedInvoices(newSelecteds);
      return;
    }
    setSelectedInvoices([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedInvoices.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedInvoices, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedInvoices.slice(1));
    } else if (selectedIndex === selectedInvoices.length - 1) {
      newSelected = newSelected.concat(selectedInvoices.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedInvoices.slice(0, selectedIndex),
        selectedInvoices.slice(selectedIndex + 1),
      );
    }

    setSelectedInvoices(newSelected);
  };

  const isSelected = (id) => selectedInvoices.indexOf(id) !== -1;

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Selected Invoices?',
      text: `Are you sure you want to delete ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        // Delete all selected invoices
        await Promise.all(selectedInvoices.map(id => invoiceAPI.delete(id)));
        
        Swal.fire({
          title: 'Deleted!',
          text: `${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's have' : ' has'} been deleted successfully.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        setSelectedInvoices([]);
        fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoices:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.error || 'Failed to delete invoices',
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      await Promise.all(
        selectedInvoices.map(id => 
          invoiceAPI.update(id, { status: newStatus })
        )
      );
      
      toast.success(`Updated ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''} to ${newStatus}`);
      setSelectedInvoices([]);
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoices:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || 'Failed to update invoice status',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleBulkExport = () => {
    // Get selected invoice data
    const selectedInvoiceData = filteredInvoices.filter(invoice => 
      selectedInvoices.includes(invoice.id)
    );

    // Define CSV headers
    const headers = ['Invoice #', 'Customer', 'Template', 'Date', 'Due Date', 'Amount', 'Status'];
    
    // Convert data to CSV format
    const csvData = selectedInvoiceData.map(invoice => {
      const template = templates.find(t => t.id === (invoice.templateId || 'default'));
      const templateName = template ? template.name : 'Default';
      
      return [
        formatInvoiceNumber(invoice.invoiceNumber, userData?.invoiceSettings?.prefix),
        invoice.customerName,
        templateName,
        invoice.date ? format(new Date(invoice.date), 'yyyy-MM-dd') : '',
        invoice.dueDate ? format(new Date(invoice.dueDate), 'yyyy-MM-dd') : '',
        invoice.total || 0,
        invoice.status
      ];
    });

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${selectedInvoiceData.length} invoice${selectedInvoiceData.length > 1 ? 's' : ''} to CSV`);
    setSelectedInvoices([]);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Skeleton variant="text" width={200} height={40} />
            <Box display="flex" gap={2}>
              <Skeleton variant="rectangular" width={100} height={40} />
              <Skeleton variant="rectangular" width={120} height={40} />
            </Box>
          </Box>
        </Paper>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </TableCell>
                  {['Invoice #', 'Customer', 'Template', 'Date', 'Due Date', 'Amount', 'Status', 'Actions'].map((header) => (
                    <TableCell key={header}>
                      <Skeleton variant="text" width={header === 'Actions' ? 150 : 80} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={20} height={20} />
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={30} /></TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} variant="circular" width={30} height={30} />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4">
            Invoices
          </Typography>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search invoices..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/invoices/create')}
            >
              New Invoice
            </Button>
          </Box>
        </Box>
      </Box>

      <Paper>
        {filteredInvoices.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm || statusFilter !== 'all' 
                ? 'No invoices found matching your criteria' 
                : 'No invoices yet'}
            </Typography>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/invoices/create')}
                sx={{ mt: 2 }}
              >
                Create Your First Invoice
              </Button>
            )}
          </Box>
        ) : (
          <>
            {selectedInvoices.length > 0 && (
              <Toolbar
                sx={{
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                  ...(selectedInvoices.length > 0 && {
                    bgcolor: (theme) =>
                      alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                  }),
                  mb: 2,
                }}
              >
                <Typography
                  sx={{ flex: '1 1 100%' }}
                  color="inherit"
                  variant="subtitle1"
                  component="div"
                >
                  {selectedInvoices.length} selected
                </Typography>

                <Tooltip title="Update Status">
                  <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                    <Select
                      value=""
                      displayEmpty
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkStatusUpdate(e.target.value);
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        Update Status
                      </MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="overdue">Overdue</MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>

                <Tooltip title="Export">
                  <IconButton onClick={handleBulkExport}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton onClick={handleBulkDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selectedInvoices.length > 0 && selectedInvoices.length < filteredInvoices.length}
                        checked={filteredInvoices.length > 0 && selectedInvoices.length === filteredInvoices.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Template</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((invoice) => (
                      <TableRow 
                        key={invoice.id}
                        hover
                        onClick={(event) => handleClick(event, invoice.id)}
                        role="checkbox"
                        aria-checked={isSelected(invoice.id)}
                        selected={isSelected(invoice.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isSelected(invoice.id)}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClick(event, invoice.id);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {formatInvoiceNumber(invoice.invoiceNumber, userData?.invoiceSettings?.prefix)}
                            {invoice.recurringInvoiceId && (
                              <Tooltip title="Generated from recurring invoice">
                                <ScheduleIcon 
                                  fontSize="small" 
                                  sx={{ color: 'primary.main', opacity: 0.7 }}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>
                          {(() => {
                            const template = templates.find(t => t.id === (invoice.templateId || 'default'));
                            const templateId = invoice.templateId || 'default';
                            const templateName = template ? template.name : 'Default';
                            
                            return (
                              <Tooltip 
                                title={
                                  <Box sx={{ p: 1 }}>
                                    <img 
                                      src={`/template-previews/${templateId}-preview.png`}
                                      alt={templateName}
                                      style={{ 
                                        width: 200, 
                                        height: 'auto',
                                        borderRadius: 4,
                                        border: '1px solid #e0e0e0'
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                    <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
                                      {templateName}
                                    </Typography>
                                  </Box>
                                }
                                arrow
                                placement="left"
                              >
                                <Chip 
                                  label={templateName}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: 'action.hover'
                                    }
                                  }}
                                />
                              </Tooltip>
                            );
                          })()}
                        </TableCell>
                        <TableCell>

                          {invoice.date && !isNaN(new Date(invoice.date).getTime())
                            ? format(new Date(invoice.date), 'MMM dd, yyyy')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {invoice.dueDate && !isNaN(new Date(invoice.dueDate).getTime())
                            ? format(new Date(invoice.dueDate), 'MMM dd, yyyy') 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
                        <TableCell>
                          <FormControl size="small">
                            <Select
                              value={invoice.status}
                              onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                              renderValue={(value) => (
                                <Chip
                                  label={value}
                                  color={getStatusColor(value)}
                                  size="small"
                                />
                              )}
                            >
                              <MenuItem value="draft">Draft</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="overdue">Overdue</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                            title="View Invoice"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/invoices/${invoice.id}?send=true`)}
                            title="Send Invoice"
                            color="primary"
                          >
                            <SendIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDuplicateInvoice(invoice)}
                            title="Duplicate Invoice"
                          >
                            <FileCopyIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadInvoice(invoice)}
                            title="Download PDF"
                          >
                            <DownloadIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                            title="Edit Invoice"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            title="Delete Invoice"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredInvoices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Invoices;
