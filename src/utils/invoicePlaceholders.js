import { format, getQuarter, getWeek, subMonths } from 'date-fns';

/**
 * Placeholders such as {{MONTH_NAME}} may be typed into line item descriptions
 * and notes. They are resolved against the invoice date at preview/save time so
 * recurring wording ("Retainer - {{MONTH_NAME}}") stays correct.
 *
 * Periods assume a monthly billing cycle, which is what recurring invoices use.
 */

const RESOLVERS = {
  PERIOD_START: (periodStart) => format(periodStart, 'MMM d'),
  PERIOD_END: (_periodStart, invoiceDate) => format(invoiceDate, 'MMM d'),
  MONTH_NAME: (periodStart) => format(periodStart, 'MMMM'),
  MONTH_SHORT: (periodStart) => format(periodStart, 'MMM'),
  YEAR: (periodStart) => format(periodStart, 'yyyy'),
  WEEK_NUMBER: (_periodStart, invoiceDate) => String(getWeek(invoiceDate)),
  QUARTER: (periodStart) => String(getQuarter(periodStart)),
};

export const PLACEHOLDER_TOKENS = Object.keys(RESOLVERS);

export const resolvePlaceholders = (text, invoiceDate) => {
  if (!text || !text.includes('{{')) return text;

  const date = invoiceDate instanceof Date ? invoiceDate : new Date(invoiceDate);
  if (Number.isNaN(date.getTime())) return text;

  const periodStart = subMonths(date, 1);

  return PLACEHOLDER_TOKENS.reduce(
    (result, token) =>
      result.replace(new RegExp(`\\{\\{${token}\\}\\}`, 'gi'), RESOLVERS[token](periodStart, date)),
    text
  );
};
