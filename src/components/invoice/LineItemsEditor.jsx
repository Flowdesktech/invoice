'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createEmptyLineItem, normalizeLineItem } from '../../utils/invoiceLineItems';
import { formatCurrency } from '../../utils/formatters';

const COLUMNS = [
  { label: 'Description', align: 'left' },
  { label: 'Qty', align: 'right', width: { xs: 80, sm: 100 } },
  { label: 'Rate', align: 'right', width: { xs: 100, sm: 120 } },
  { label: 'Amount', align: 'right', width: { xs: 100, sm: 120 } },
];

const LineItemsEditor = ({ items, currency, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const updateItem = (index, field, value) => {
    onChange(items.map((item, i) => (i === index ? normalizeLineItem({ ...item, [field]: value }) : item)));
  };

  const addItem = () => onChange([...items, createEmptyLineItem()]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    onChange(items.filter((_item, i) => i !== index));
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Line Items
        </Typography>
        <Button startIcon={<AddIcon />} onClick={addItem} size="small">
          Add Item
        </Button>
      </Box>

      {isMobile ? (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {items.map((item, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Item #{index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  sx={{ mt: -1, mr: -1 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Description"
                value={item.description}
                onChange={(event) => updateItem(index, 'description', event.target.value)}
                placeholder="Item description"
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid size={4}>
                  <TextField
                    type="number"
                    size="small"
                    label="Qty"
                    fullWidth
                    value={item.quantity}
                    onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                    inputProps={{ min: 0, step: 1 }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    type="number"
                    size="small"
                    label="Rate"
                    fullWidth
                    value={item.rate}
                    onChange={(event) => updateItem(index, 'rate', event.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid size={4}>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatCurrency(item.amount, currency)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 600, sm: 700 } }}>
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.label}
                    align={column.align}
                    sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' }, width: column.width }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell sx={{ width: 50 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.description}
                      onChange={(event) => updateItem(index, 'description', event.target.value)}
                      placeholder="Item description"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                      inputProps={{ min: 0, step: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={item.rate}
                      onChange={(event) => updateItem(index, 'rate', event.target.value)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(item.amount, currency)}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => removeItem(index)} disabled={items.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default LineItemsEditor;
