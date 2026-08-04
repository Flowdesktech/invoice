import { describe, expect, it } from 'vitest';
import { differenceInCalendarDays } from 'date-fns';
import {
  blankFormValues,
  duplicateFormValues,
  invoiceToFormValues,
} from '../../src/utils/invoiceFormValues.js';

const settings = {
  prefix: 'INV',
  nextNumber: 12,
  taxRate: 5,
  paymentTerms: 'Net 30',
  currency: 'EUR',
  dueDateDuration: 14,
  autoIncrementNumber: true,
};

const sourceInvoice = {
  id: 'inv-1',
  customerId: 'cus-9',
  invoiceNumber: 5,
  date: new Date('2026-01-10').getTime(),
  dueDate: new Date('2026-01-17').getTime(),
  status: 'paid',
  notes: 'Thanks for your business',
  taxRate: 7.5,
  paymentTerms: 'Net 15',
  currency: 'GBP',
  templateId: 'modern-blue',
  lineItems: [{ description: 'Design work', quantity: 2, rate: 150, amount: 300 }],
};

describe('duplicateFormValues', () => {
  const today = new Date('2026-03-01T09:00:00Z');
  const duplicate = duplicateFormValues(sourceInvoice, settings, today);

  it('numbers the copy one after the invoice it was duplicated from', () => {
    expect(duplicate.invoiceNumber).toBe(6);
  });

  it('carries over every content field from the source invoice', () => {
    expect(duplicate.customerId).toBe('cus-9');
    expect(duplicate.notes).toBe('Thanks for your business');
    expect(duplicate.taxRate).toBe(7.5);
    expect(duplicate.paymentTerms).toBe('Net 15');
    expect(duplicate.currency).toBe('GBP');
    expect(duplicate.templateId).toBe('modern-blue');
  });

  it('starts a fresh document rather than copying dates and status', () => {
    expect(duplicate.status).toBe('draft');
    expect(duplicate.date).toEqual(today);
    expect(differenceInCalendarDays(duplicate.dueDate, today)).toBe(settings.dueDateDuration);
  });

  it('treats a missing or non-numeric source number as starting at 1', () => {
    expect(duplicateFormValues({ ...sourceInvoice, invoiceNumber: undefined }, settings).invoiceNumber).toBe(1);
    expect(duplicateFormValues({ ...sourceInvoice, invoiceNumber: 'INV-0004' }, settings).invoiceNumber).toBe(1);
  });

  it('increments correctly when the stored number is a numeric string', () => {
    expect(duplicateFormValues({ ...sourceInvoice, invoiceNumber: '41' }, settings).invoiceNumber).toBe(42);
  });
});

describe('invoiceToFormValues', () => {
  it('keeps the invoice number and status when editing', () => {
    const values = invoiceToFormValues(sourceInvoice, settings);
    expect(values.invoiceNumber).toBe(5);
    expect(values.status).toBe('paid');
    expect(values.date).toEqual(new Date(sourceInvoice.date));
  });

  it('falls back to profile settings for missing terms and currency', () => {
    const values = invoiceToFormValues({ customerId: 'cus-1' }, settings);
    expect(values.paymentTerms).toBe('Net 30');
    expect(values.currency).toBe('EUR');
  });
});

describe('blankFormValues', () => {
  it('uses the account sequence and profile defaults', () => {
    const values = blankFormValues(settings, 12);
    expect(values.invoiceNumber).toBe(12);
    expect(values.taxRate).toBe(5);
    expect(values.currency).toBe('EUR');
    expect(values.customerId).toBeNull();
  });
});
