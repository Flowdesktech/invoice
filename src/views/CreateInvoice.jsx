'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, Container, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import CustomerDialog from '../components/CustomerDialog';
import RecurringInvoiceDialog from '../components/RecurringInvoiceDialog';
import CustomerSection from '../components/invoice/CustomerSection';
import InvoiceDetailsFields from '../components/invoice/InvoiceDetailsFields';
import InvoiceSummary from '../components/invoice/InvoiceSummary';
import LineItemsEditor from '../components/invoice/LineItemsEditor';
import TemplateSelector from '../components/invoice/TemplateSelector';

import { useCustomers } from '../hooks/useCustomers';
import { useInvoiceSettings } from '../hooks/useInvoiceSettings';
import { EDITOR_MODE, useInvoiceEditorSource } from '../hooks/useInvoiceEditorSource';
import { invoiceAPI } from '../utils/api';
import { openPdfInNewTab } from '../utils/pdfUtils';
import { calculateTotals, isBillableLineItem, normalizeLineItems } from '../utils/invoiceLineItems';
import { resolvePlaceholders } from '../utils/invoicePlaceholders';
import { saveInvoiceDraft } from '../utils/invoiceDraft';
import { templates } from './InvoiceTemplates';

const showError = (error, fallback) =>
  Swal.fire({
    title: 'Error!',
    text: error?.response?.data?.error || error?.response?.data?.message || fallback,
    icon: 'error',
    confirmButtonColor: '#3085d6',
  });

const SectionHeading = ({ children }) => (
  <Typography
    variant="h6"
    gutterBottom
    sx={{ fontWeight: 600, mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
  >
    {children}
  </Typography>
);

const CreateInvoice = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const duplicateFromId = searchParams.get('duplicate');
  const templateIdFromQuery = searchParams.get('templateId');

  const { settings } = useInvoiceSettings();
  const { customers, loading: loadingCustomers, addCustomer, replaceCustomer } = useCustomers();
  const {
    mode,
    loading: loadingSource,
    values: initialValues,
    lineItems: initialLineItems,
    error: sourceError,
  } = useInvoiceEditorSource({ invoiceId: id, duplicateFromId, templateIdFromQuery });

  const isEditMode = mode === EDITOR_MODE.EDIT;

  const [lineItems, setLineItems] = useState(() => normalizeLineItems(null));
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [customerDialog, setCustomerDialog] = useState({ open: false, customer: null });
  const [setAsRecurring, setSetAsRecurring] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState(null);

  const { control, handleSubmit, watch, setValue, reset, getValues } = useForm({
    defaultValues: {
      customerId: null,
      invoiceNumber: '',
      date: new Date(),
      dueDate: new Date(),
      status: 'draft',
      notes: '',
      taxRate: 0,
      paymentTerms: 'Due on receipt',
      currency: 'USD',
      templateId: null,
    },
  });

  const customerId = watch('customerId');
  const taxRate = watch('taxRate');
  const currency = watch('currency');
  const templateId = watch('templateId');

  // Populate the form once the source (new / edit / duplicate) is resolved.
  const initialisedRef = useRef(false);
  useEffect(() => {
    if (loadingSource || !initialValues || initialisedRef.current) return;
    reset(initialValues);
    setLineItems(initialLineItems);
    initialisedRef.current = true;

    if (mode === EDITOR_MODE.DUPLICATE) {
      toast.success('Invoice duplicated - review and save');
    }
  }, [loadingSource, initialValues, initialLineItems, mode, reset]);

  useEffect(() => {
    if (!sourceError) return;
    showError(sourceError, 'Failed to load invoice data').then(() => navigate('/invoices'));
  }, [sourceError, navigate]);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === customerId) || null,
    [customers, customerId]
  );
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === templateId) || null,
    [templateId]
  );
  const totals = useMemo(() => calculateTotals(lineItems, taxRate), [lineItems, taxRate]);

  const buildPayload = (values) => ({
    customerId: values.customerId,
    invoiceNumber: values.invoiceNumber,
    lineItems: lineItems
      .filter(isBillableLineItem)
      .map((item) => ({ ...item, description: resolvePlaceholders(item.description, values.date) })),
    taxRate: values.taxRate || 0,
    notes: resolvePlaceholders(values.notes, values.date),
    paymentTerms: values.paymentTerms,
    date: new Date(values.date).getTime(),
    dueDate: new Date(values.dueDate).getTime(),
    status: values.status,
    currency: values.currency,
    templateId: values.templateId || null,
  });

  const handleChangeTemplate = () => {
    const values = getValues();
    saveInvoiceDraft({
      mode,
      sourceId: id || duplicateFromId || null,
      values,
      lineItems,
    });

    const returnParams = new URLSearchParams(searchParams);
    returnParams.delete('templateId');
    const basePath = isEditMode ? `/invoices/${id}/edit` : '/invoices/create';
    const query = returnParams.toString();
    const returnPath = query ? `${basePath}?${query}` : basePath;

    navigate(`/invoice-templates?returnPath=${encodeURIComponent(returnPath)}`);
  };

  const handlePreview = async () => {
    try {
      setPreviewLoading(true);
      const values = getValues();
      const { data } = await invoiceAPI.preview(buildPayload(values));
      openPdfInNewTab(data?.pdf, { filename: `invoice_${values.invoiceNumber}_preview.pdf` });
    } catch (error) {
      console.error('Error generating preview:', error);
      showError(error, 'Failed to generate preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const onSubmit = async (values) => {
    if (!lineItems.some(isBillableLineItem)) {
      toast.error('Please add at least one line item');
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload(values);

      if (isEditMode) {
        await invoiceAPI.update(id, payload);
        toast.success('Invoice updated successfully!');
        navigate(`/invoices/${id}`);
        return;
      }

      const { data } = await invoiceAPI.create(payload);
      toast.success('Invoice created successfully!');

      if (!setAsRecurring) {
        navigate(`/invoices/${data.id}`);
        return;
      }

      setCreatedInvoice({
        ...data,
        lineItems: payload.lineItems,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer?.name,
        customerEmail: selectedCustomer?.email,
        taxRate: payload.taxRate,
        notes: payload.notes,
        paymentTerms: payload.paymentTerms,
      });
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} invoice:`, error);
      showError(error, `Failed to ${isEditMode ? 'update' : 'create'} invoice`);
    } finally {
      setSaving(false);
    }
  };

  if (loadingCustomers || loadingSource) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <CircularProgress size={48} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            {loadingSource ? 'Loading invoice...' : 'Loading customers...'}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 3 } }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: { xs: 3, sm: 4 }, px: { xs: 2, sm: 0 } }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1, display: { xs: 'none', sm: 'block' } }}
          >
            {isEditMode ? 'Edit Invoice' : 'Create Invoice'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? 'Update the invoice details below'
              : 'Fill in the details below to create a new invoice'}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 12, lg: 8, xl: 9 }}>
            <TemplateSelector template={selectedTemplate} onChangeTemplate={handleChangeTemplate} />

            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <SectionHeading>Customer Selection</SectionHeading>
              <CustomerSection
                control={control}
                customers={customers}
                selectedCustomer={selectedCustomer}
                onAddCustomer={() => setCustomerDialog({ open: true, customer: null })}
                onEditCustomer={() => setCustomerDialog({ open: true, customer: selectedCustomer })}
              />

              <SectionHeading>Invoice Details</SectionHeading>
              <InvoiceDetailsFields control={control} setValue={setValue} settings={settings} mode={mode} />
            </Paper>

            <Paper sx={{ p: { xs: 2, sm: 3 }, overflow: 'hidden' }}>
              <LineItemsEditor items={lineItems} currency={currency} onChange={setLineItems} />

              <Box mt={4}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Additional Information
                </Typography>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notes & Terms"
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="Enter any additional notes, terms, or special instructions for this invoice"
                    />
                  )}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }} sx={{ order: { xs: -1, sm: -1, md: 2, lg: 2 } }}>
            <InvoiceSummary
              control={control}
              customer={selectedCustomer}
              totals={totals}
              currency={currency}
              taxRate={taxRate}
              isEditMode={isEditMode}
              recurring={setAsRecurring}
              onRecurringChange={setSetAsRecurring}
              onPreview={handlePreview}
              onCancel={() => navigate('/invoices')}
              previewDisabled={!selectedCustomer || !lineItems.some((item) => item.description)}
              previewLoading={previewLoading}
              saving={saving}
            />
          </Grid>
        </Grid>
      </form>

      <CustomerDialog
        open={customerDialog.open}
        onClose={() => setCustomerDialog({ open: false, customer: null })}
        customer={customerDialog.customer}
        editMode={Boolean(customerDialog.customer)}
        onCustomerCreated={(customer) => {
          addCustomer(customer);
          setValue('customerId', customer.id, { shouldValidate: true });
        }}
        onCustomerUpdated={(customer) => {
          replaceCustomer(customer);
          setValue('customerId', customer.id, { shouldValidate: true });
        }}
      />

      {createdInvoice && (
        <RecurringInvoiceDialog
          open
          onClose={() => navigate(`/invoices/${createdInvoice.id}`)}
          invoiceData={{ ...createdInvoice, startDate: createdInvoice.date }}
          onSuccess={() => navigate('/recurring-invoices')}
        />
      )}
    </Container>
  );
};

export default CreateInvoice;
