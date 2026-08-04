'use client';

import React from 'react';
import { Autocomplete, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';

const ADD_NEW_OPTION = { id: 'new', name: '+ Add New Customer' };

const formatCityLine = (address = {}) =>
  [address.city, address.state, address.zipCode].filter(Boolean).join(', ');

const CustomerDetails = ({ customer, onEdit }) => (
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
      <Button size="small" startIcon={<EditIcon />} onClick={onEdit} sx={{ textTransform: 'none' }}>
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
          {customer.name}
        </Typography>
        {customer.company && (
          <Typography variant="body2" color="text.secondary">
            {customer.company}
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
        <Typography variant="body2">{customer.email}</Typography>
        {customer.phone && (
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2">{customer.phone}</Typography>
          </Box>
        )}
      </Grid>

      {customer.address && (
        <Grid size={12}>
          <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
            <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Address
              </Typography>
              {customer.address.street && <Typography variant="body2">{customer.address.street}</Typography>}
              {formatCityLine(customer.address) && (
                <Typography variant="body2">{formatCityLine(customer.address)}</Typography>
              )}
              {customer.address.country && <Typography variant="body2">{customer.address.country}</Typography>}
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
  </Paper>
);

/**
 * The form stores `customerId` rather than the customer object, so the
 * selection stays valid no matter when the customer list finishes loading.
 */
const CustomerSection = ({ control, customers, selectedCustomer, onAddCustomer, onEditCustomer }) => (
  <>
    <Box sx={{ mb: 4 }}>
      <Controller
        name="customerId"
        control={control}
        rules={{ required: 'Customer is required' }}
        render={({ field, fieldState }) => (
          <Autocomplete
            options={[ADD_NEW_OPTION, ...customers]}
            value={customers.find((customer) => customer.id === field.value) || null}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            onChange={(_event, option) => {
              if (option?.id === ADD_NEW_OPTION.id) {
                onAddCustomer();
                return;
              }
              field.onChange(option?.id ?? null);
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const isAddNew = option.id === ADD_NEW_OPTION.id;
              return (
                <Box
                  component="li"
                  key={key}
                  {...optionProps}
                  sx={{
                    fontWeight: isAddNew ? 600 : 400,
                    color: isAddNew ? 'primary.main' : 'inherit',
                    borderBottom: isAddNew ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  {isAddNew && <AddIcon sx={{ mr: 1, fontSize: 20 }} />}
                  {option.name}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer *"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        )}
      />
    </Box>

    {selectedCustomer && (
      <Box sx={{ mb: 4 }}>
        <CustomerDetails customer={selectedCustomer} onEdit={onEditCustomer} />
      </Box>
    )}
  </>
);

export default CustomerSection;
