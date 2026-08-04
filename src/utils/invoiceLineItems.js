/**
 * Line item shape and money maths shared by the invoice editor.
 * The backend recalculates totals on save; these helpers exist so the UI shows
 * the same numbers before the round trip.
 */

export const createEmptyLineItem = () => ({
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
});

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeLineItem = (item = {}) => {
  const quantity = toNumber(item.quantity);
  const rate = toNumber(item.rate);
  return {
    description: item.description || '',
    quantity,
    rate,
    amount: quantity * rate,
  };
};

export const normalizeLineItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [createEmptyLineItem()];
  }
  return items.map(normalizeLineItem);
};

export const isBillableLineItem = (item) => Boolean(item.description) && item.amount > 0;

export const calculateTotals = (lineItems = [], taxRate = 0) => {
  const subtotal = lineItems.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const taxAmount = (subtotal * toNumber(taxRate)) / 100;
  return { subtotal, taxAmount, total: subtotal + taxAmount };
};
