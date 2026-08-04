import { addDays } from 'date-fns';

/**
 * Pure mappers between stored invoices and the invoice editor's form values.
 * Kept free of React and network calls so the duplication rules stay testable.
 */

const toDate = (value, fallback) => {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
};

export const invoiceToFormValues = (invoice, settings) => ({
  customerId: invoice.customerId || null,
  invoiceNumber: invoice.invoiceNumber ?? '',
  date: toDate(invoice.date, new Date()),
  dueDate: toDate(invoice.dueDate, addDays(new Date(), settings.dueDateDuration)),
  status: invoice.status || 'draft',
  notes: invoice.notes || '',
  taxRate: Number(invoice.taxRate) || 0,
  paymentTerms: invoice.paymentTerms || settings.paymentTerms,
  currency: invoice.currency || settings.currency,
  templateId: invoice.templateId || null,
});

export const blankFormValues = (settings, nextNumber) => ({
  customerId: null,
  invoiceNumber: nextNumber,
  date: new Date(),
  dueDate: addDays(new Date(), settings.dueDateDuration),
  status: 'draft',
  notes: '',
  taxRate: settings.taxRate,
  paymentTerms: settings.paymentTerms,
  currency: settings.currency,
  templateId: null,
});

/**
 * A duplicate keeps the source invoice's content (customer, line items, tax,
 * notes, terms, currency, template) but starts a new document: today's dates,
 * draft status, and the next number after the invoice it was copied from.
 */
export const duplicateFormValues = (source, settings, today = new Date()) => {
  const sourceNumber = Number(source.invoiceNumber);

  return {
    ...invoiceToFormValues(source, settings),
    invoiceNumber: (Number.isFinite(sourceNumber) ? sourceNumber : 0) + 1,
    date: today,
    dueDate: addDays(today, settings.dueDateDuration),
    status: 'draft',
  };
};
