/**
 * Utility functions for formatting data
 */

/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount || 0);
};

/**
 * Format date values with timezone support
 * @param {string|Date} date - The date to format
 * @param {string} timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns {string} Formatted date string
 */
const formatDate = (date, timezone = 'America/New_York') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone
  }).format(dateObj);
};

/**
 * Format date for display in short format with timezone support
 * @param {string|Date} date - The date to format
 * @param {string} timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns {string} Formatted date string (MMM DD, YYYY)
 */
const formatDateShort = (date, timezone = 'America/New_York') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: timezone
  }).format(dateObj);
};

/**
 * Format invoice number with prefix
 * @param {number} number - Invoice number (without prefix)
 * @param {string} prefix - Invoice prefix
 * @param {number} padding - Number of digits to pad (default: 5)
 * @returns {string} Formatted invoice number
 */
const formatInvoiceNumber = (number, prefix = 'INV', padding = 5) => {
  if (!number && number !== 0) return '';
  return `${prefix}-${String(number).padStart(padding, '0')}`;
};

/**
 * Generate invoice number with padding (deprecated - use formatInvoiceNumber)
 * @param {string} prefix - Invoice prefix
 * @param {number} number - Invoice number
 * @param {number} padding - Number of digits to pad (default: 5)
 * @returns {string} Formatted invoice number
 */
const generateInvoiceNumber = (prefix, number, padding = 5) => {
  return formatInvoiceNumber(number, prefix, padding);
};

/**
 * Calculate invoice totals
 * @param {Array} lineItems - Array of line items
 * @param {number} taxRate - Tax rate percentage
 * @returns {Object} Calculated totals
 */
const calculateInvoiceTotals = (lineItems = [], taxRate = 0) => {
  const subtotal = lineItems.reduce((sum, item) => {
    const amount = (item.quantity || 0) * (item.rate || 0);
    return sum + amount;
  }, 0);
  
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  
  return {
    subtotal,
    taxAmount,
    total
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Sanitize string for safe storage
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Format date for template placeholders with timezone support
 * @param {string|Date} date - The date to format
 * @param {string} format - Format string (e.g., 'MMM d', 'MMMM', 'yyyy')
 * @param {string} timezone - IANA timezone string
 * @returns {string} Formatted date string
 */
const formatDateForTemplate = (date, format, timezone = 'America/New_York') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // Create formatter options based on format string
  const options = { timeZone: timezone };
  
  switch (format) {
    case 'MMM d':
      options.month = 'short';
      options.day = 'numeric';
      break;
    case 'MMMM':
      options.month = 'long';
      break;
    case 'MMM':
      options.month = 'short';
      break;
    case 'yyyy':
      options.year = 'numeric';
      break;
    default:
      // Default to short date format
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

module.exports = {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatDateForTemplate,
  formatInvoiceNumber,
  generateInvoiceNumber,
  calculateInvoiceTotals,
  isValidEmail,
  sanitizeString
};
