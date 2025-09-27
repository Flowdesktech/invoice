import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Checkbox,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Send as SendIcon,
  FileCopy as FileCopyIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/formatters';
import { formatInvoiceNumber } from '../utils/formatters';

const InvoiceCard = ({ 
  invoice, 
  isSelected,
  onCheckboxChange,
  onView,
  onSend,
  onDuplicate,
  onDownload,
  onEdit,
  onDelete,
  showCheckbox = true,
  userData,
  getStatusColor,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  selectedInvoiceId,
}) => {
  const isMenuOpen = Boolean(anchorEl) && selectedInvoiceId === invoice.id;
  
  const handleAction = (action) => {
    action();
    onMenuClose();
  };

  return (
    <Box
      sx={{
        bgcolor: isSelected ? 'action.hover' : 'background.paper',
        borderRadius: 2,
        p: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        '&:active': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
        },
        cursor: 'pointer'
      }}
      onClick={() => onView && onView()}
    >
      {/* Header with Checkbox and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Box display="flex" alignItems="flex-start" gap={1} flex={1}>
          {showCheckbox && (
            <Checkbox
              size="small"
              color="primary"
              checked={isSelected}
              onChange={onCheckboxChange}
              onClick={(event) => event.stopPropagation()}
              sx={{ pt: 0 }}
            />
          )}
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
              {formatInvoiceNumber(invoice.invoiceNumber, userData?.invoiceSettings?.prefix)}
              {invoice.recurringInvoiceId && (
                <ScheduleIcon 
                  sx={{ 
                    fontSize: 14, 
                    color: 'primary.main', 
                    opacity: 0.7,
                    ml: 0.5,
                    verticalAlign: 'middle'
                  }}
                />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {invoice.customerName}
            </Typography>
            
            {/* Mobile Status Chip */}
            <Chip
              label={invoice.status}
              color={getStatusColor ? getStatusColor(invoice.status) : 'default'}
              size="small"
              sx={{ height: 24 }}
            />
          </Box>
        </Box>
        
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            onMenuOpen(event, invoice.id);
          }}
          sx={{ mt: -0.5, mr: -0.5 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Compact Info Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            {invoice.date && !isNaN(new Date(invoice.date).getTime())
              ? format(new Date(invoice.date), 'MMM dd')
              : 'No date'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Due: {invoice.dueDate && !isNaN(new Date(invoice.dueDate).getTime())
              ? format(new Date(invoice.dueDate), 'MMM dd')
              : 'N/A'}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="600" color="text.primary">
          {formatCurrency(invoice.total, invoice.currency)}
        </Typography>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={onMenuClose}
      >
        {onView && (
          <MenuItem onClick={() => handleAction(onView)}>
            <ViewIcon sx={{ mr: 1, fontSize: 20 }} /> View
          </MenuItem>
        )}
        {onSend && (
          <MenuItem onClick={() => handleAction(onSend)}>
            <SendIcon sx={{ mr: 1, fontSize: 20 }} /> Send
          </MenuItem>
        )}
        {onDuplicate && (
          <MenuItem onClick={() => handleAction(onDuplicate)}>
            <FileCopyIcon sx={{ mr: 1, fontSize: 20 }} /> Duplicate
          </MenuItem>
        )}
        {onDownload && (
          <MenuItem onClick={() => handleAction(onDownload)}>
            <DownloadIcon sx={{ mr: 1, fontSize: 20 }} /> Download
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <EditIcon sx={{ mr: 1, fontSize: 20 }} /> Edit
          </MenuItem>
        )}
        {onDelete && (
          <>
            <Divider />
            <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1, fontSize: 20 }} /> Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default InvoiceCard;
