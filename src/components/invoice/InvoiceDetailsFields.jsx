'use client';

import React from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import { addDays } from 'date-fns';
import { formatInvoiceNumber } from '../../utils/formatters';
import { EDITOR_MODE } from '../../hooks/useInvoiceEditorSource';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
];

const InvoiceNumberField = ({ control, settings, mode }) => (
  <Controller
    name="invoiceNumber"
    control={control}
    render={({ field }) => {
      const savedAs = formatInvoiceNumber(field.value || settings.nextNumber, settings.prefix);
      const helperText =
        mode === EDITOR_MODE.EDIT
          ? 'Update invoice number'
          : field.value || settings.autoIncrementNumber
            ? `Will be saved as: ${savedAs}`
            : 'Enter invoice number';

      return (
        <TextField
          {...field}
          value={field.value ?? ''}
          onChange={(event) => {
            const digitsOnly = event.target.value.replace(/[^0-9]/g, '');
            field.onChange(digitsOnly ? parseInt(digitsOnly, 10) : '');
          }}
          label="Invoice #"
          type="text"
          fullWidth
          size="medium"
          placeholder={mode !== EDITOR_MODE.EDIT ? String(settings.nextNumber) : ''}
          helperText={helperText}
          inputProps={{ style: { textAlign: 'right' } }}
          sx={{ '& .MuiFormHelperText-root': { fontSize: '0.7rem', color: 'text.secondary' } }}
        />
      );
    }}
  />
);

const InvoiceDetailsFields = ({ control, setValue, settings, mode }) => (
  <Grid container spacing={{ xs: 2, sm: 3 }}>
    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 2 }}>
      <InvoiceNumberField control={control} settings={settings} mode={mode} />
    </Grid>

    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Invoice Date *"
            value={field.value}
            onChange={(date) => {
              field.onChange(date);
              if (date) setValue('dueDate', addDays(date, settings.dueDateDuration));
            }}
            slotProps={{ textField: { fullWidth: true } }}
          />
        )}
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
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  </Grid>
);

export default InvoiceDetailsFields;
