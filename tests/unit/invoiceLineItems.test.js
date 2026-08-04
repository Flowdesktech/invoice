import { describe, expect, it } from 'vitest';
import {
  calculateTotals,
  isBillableLineItem,
  normalizeLineItems,
} from '../../src/utils/invoiceLineItems.js';

describe('normalizeLineItems', () => {
  it('recalculates amounts from quantity and rate', () => {
    const [item] = normalizeLineItems([{ description: 'Work', quantity: '3', rate: '25.5' }]);
    expect(item).toEqual({ description: 'Work', quantity: 3, rate: 25.5, amount: 76.5 });
  });

  it('returns a single empty row when there is nothing to copy', () => {
    expect(normalizeLineItems(null)).toEqual([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
  });
});

describe('calculateTotals', () => {
  it('applies the tax rate to the subtotal', () => {
    const items = normalizeLineItems([
      { description: 'A', quantity: 2, rate: 100 },
      { description: 'B', quantity: 1, rate: 50 },
    ]);
    expect(calculateTotals(items, 10)).toEqual({ subtotal: 250, taxAmount: 25, total: 275 });
  });
});

describe('isBillableLineItem', () => {
  it('ignores rows without a description or amount', () => {
    expect(isBillableLineItem({ description: '', amount: 100 })).toBe(false);
    expect(isBillableLineItem({ description: 'A', amount: 0 })).toBe(false);
    expect(isBillableLineItem({ description: 'A', amount: 10 })).toBe(true);
  });
});
