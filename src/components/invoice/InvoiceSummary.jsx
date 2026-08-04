'use client';

import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import currencyOptions from '../../data/currencyOptions.json';
import { formatCurrency } from '../../utils/formatters';

const BillTo = ({ customer }) => (
  <Box
    mb={{ xs: 2, sm: 3 }}
    sx={{
      p: { xs: 1, sm: 1.5, md: 2 },
      backgroundColor: '#f8fafc',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      display: { xs: 'none', sm: 'block' },
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
      Bill To:
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
      {customer.name}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {customer.email}
    </Typography>
    {customer.address?.street && (
      <>
        <Typography variant="body2">{customer.address.street}</Typography>
        <Typography variant="body2">
          {[customer.address.city, customer.address.state, customer.address.zipCode].filter(Boolean).join(', ')}
        </Typography>
      </>
    )}
  </Box>
);

const TotalsRow = ({ label, value, currency }) => (
  <Box display="flex" justifyContent="space-between" mb={{ xs: 1, sm: 2 }}>
    <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
      {formatCurrency(value, currency)}
    </Typography>
  </Box>
);

const InvoiceSummary = ({
  control,
  customer,
  totals,
  currency,
  taxRate,
  isEditMode,
  recurring,
  onRecurringChange,
  onPreview,
  onCancel,
  previewDisabled,
  previewLoading,
  saving,
}) => (
  <Box sx={{ position: { lg: 'sticky' }, top: { lg: 20 } }}>
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        mb: { xs: 2, sm: 3 },
        borderRadius: { xs: 1, sm: 2 },
        border: '1px solid',
        borderColor: 'divider',
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
        }}
      >
        Invoice Summary
      </Typography>

      {customer && <BillTo customer={customer} />}

      <Grid container spacing={2} mb={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Currency</InputLabel>
                <Select {...field} label="Currency">
                  {currencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {option.symbol}
                        </Typography>
                        <Typography variant="body2">{option.label}</Typography>
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
                onChange={(event) => field.onChange(event.target.value === '' ? 0 : Number(event.target.value))}
                label="Tax Rate (%)"
                type="number"
                size="small"
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box mb={3}>
        <Controller
          name="paymentTerms"
          control={control}
          render={({ field }) => <TextField {...field} label="Payment Terms" size="small" fullWidth />}
        />
      </Box>

      <Box
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          backgroundColor: '#f1f5f9',
          borderRadius: { xs: 1, sm: 2 },
          border: '1px solid',
          borderColor: 'divider',
          mb: { xs: 2, sm: 3 },
        }}
      >
        <TotalsRow label="Subtotal" value={totals.subtotal} currency={currency} />
        <TotalsRow label={`Tax (${taxRate || 0}%)`} value={totals.taxAmount} currency={currency} />
        <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Total Due
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' } }}
          >
            {formatCurrency(totals.total, currency)}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={{ xs: 1, sm: 1.5, md: 2 }}>
        {!isEditMode && (
          <FormControlLabel
            control={
              <Checkbox
                checked={recurring}
                onChange={(event) => onRecurringChange(event.target.checked)}
                color="primary"
              />
            }
            label="Set as recurring invoice"
            sx={{ mb: 1 }}
          />
        )}

        <Button
          variant="outlined"
          fullWidth
          size="large"
          startIcon={<PreviewIcon />}
          onClick={onPreview}
          disabled={previewDisabled || previewLoading}
          sx={{ py: { xs: 1, sm: 1.5 }, fontWeight: 600, textTransform: 'none' }}
        >
          {previewLoading ? 'Generating...' : 'Preview Invoice'}
        </Button>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          startIcon={saving ? null : <SaveIcon />}
          disabled={saving}
          sx={{ py: { xs: 1, sm: 1.5 }, fontWeight: 600, textTransform: 'none' }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'Update Invoice' : 'Create Invoice'}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          size="medium"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          disabled={saving}
          sx={{ py: { xs: 0.75, sm: 1 }, textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  </Box>
);

export default InvoiceSummary;
