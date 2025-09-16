import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const SendInvoiceDialog = ({ 
  open, 
  onClose, 
  invoice, 
  customer, 
  onSend 
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);

  // Initialize recipients with customer email when dialog opens
  useEffect(() => {
    if (open && customer?.email) {
      setRecipients([{ email: customer.email, isPrimary: true, name: customer.name }]);
    }
  }, [open, customer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddRecipient = () => {
    const trimmedEmail = newRecipient.trim().toLowerCase();
    
    if (!trimmedEmail) {
      setEmailError('Please enter an email address');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (recipients.some(r => r.email.toLowerCase() === trimmedEmail)) {
      setEmailError('This email is already in the recipient list');
      return;
    }
    
    setRecipients([...recipients, { email: trimmedEmail, isPrimary: false }]);
    setNewRecipient('');
    setEmailError('');
  };

  const handleRemoveRecipient = (emailToRemove) => {
    setRecipients(recipients.filter(r => r.email !== emailToRemove));
  };

  const handleSend = async () => {
    try {
      setSending(true);
      // Pass recipients array instead of just the message
      const recipientEmails = recipients.map(r => r.email);
      await onSend({ message: customMessage, recipients: recipientEmails });
      handleClose();
    } catch (error) {
      // Error handling is done in parent component
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setCustomMessage('');
      setRecipients([]);
      setNewRecipient('');
      setEmailError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={sending}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <EmailIcon color="primary" />
          Send Invoice by Email
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Recipients Section */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Recipients
            </Typography>
            
            {/* Current Recipients List */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Stack spacing={1}>
                {recipients.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No recipients added yet
                  </Typography>
                ) : (
                  recipients.map((recipient, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: recipient.isPrimary ? 'primary.50' : 'grey.50',
                        border: '1px solid',
                        borderColor: recipient.isPrimary ? 'primary.200' : 'grey.200'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" color={recipient.isPrimary ? "primary" : "action"} />
                        <Typography variant="body2">
                          {recipient.email}
                        </Typography>
                        {recipient.isPrimary && (
                          <Chip
                            label="Primary"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        {recipient.name && (
                          <Typography variant="body2" color="text.secondary">
                            ({recipient.name})
                          </Typography>
                        )}
                      </Box>
                      {!recipient.isPrimary && (
                        <Tooltip title="Remove recipient">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveRecipient(recipient.email)}
                            disabled={sending}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ))
                )}
              </Stack>
            </Paper>

            {/* Add New Recipient */}
            <Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Add additional recipient email"
                value={newRecipient}
                onChange={(e) => {
                  setNewRecipient(e.target.value);
                  setEmailError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRecipient();
                  }
                }}
                error={!!emailError}
                helperText={emailError}
                disabled={sending}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAddRecipient}
                        disabled={sending || !newRecipient.trim()}
                        edge="end"
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                You can add multiple recipients. They will all receive a copy of the invoice.
              </Typography>
            </Box>
          </Box>

          {/* Invoice Details */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Invoice Details
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="body2">
                Invoice Number: <strong>{invoice?.formattedInvoiceNumber}</strong>
              </Typography>
              <Typography variant="body2">
                Amount: <strong>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice?.currency || 'USD'
                }).format(invoice?.total || 0)}</strong>
              </Typography>
            </Box>
          </Box>

          {/* Email Preview */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Email Preview
            </Typography>
            <Alert severity="info" icon={false} sx={{ bgcolor: 'grey.50' }}>
              <Typography variant="body2" gutterBottom>
                <strong>Subject:</strong> Invoice {invoice?.formattedInvoiceNumber} from {invoice?.userData?.company || 'Your Company'}
              </Typography>
              <Typography variant="body2">
                The customer will receive an email with the invoice PDF attached and a summary of the invoice details.
              </Typography>
            </Alert>
          </Box>

          {/* Custom Message */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Add a Personal Message (Optional)
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              placeholder="Add a personal message to include in the email..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              disabled={sending}
            />
          </Box>

          {/* Email Body Editing - Pro Feature Placeholder */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Email Body
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.50',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box>
                <Typography variant="body2" paragraph>
                  Dear {customer?.name || 'Customer'},
                </Typography>
                <Typography variant="body2" paragraph>
                  Please find attached invoice {invoice?.formattedInvoiceNumber} for {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: invoice?.currency || 'USD'
                  }).format(invoice?.total || 0)}.
                </Typography>
                {customMessage && (
                  <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                    {customMessage}
                  </Typography>
                )}
                <Typography variant="body2" paragraph>
                  Thank you for your business!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.75rem' }}>
                  Best regards,<br />
                  {invoice?.userData?.displayName || invoice?.userData?.company || 'Your Name'}
                </Typography>
              </Box>
              
              {/* Pro Feature Notice */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <LockIcon fontSize="small" sx={{ color: '#3b82f6' }} />
                <Typography variant="caption" color="text.secondary">
                  Email body customization
                </Typography>
                <Chip 
                  label="Pro" 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    bgcolor: '#3b82f6',
                    color: 'white'
                  }}
                />
              </Box>
            </Paper>
            <Typography variant="caption" color="text.secondary">
              Upgrade to Pro to customize the email template
            </Typography>
          </Box>

          {/* Warning if no recipients */}
          {recipients.length === 0 && (
            <Alert severity="error">
              Please add at least one recipient email address to send the invoice.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={sending}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={recipients.length === 0 || sending}
          startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {sending ? 'Sending...' : `Send to ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendInvoiceDialog;
