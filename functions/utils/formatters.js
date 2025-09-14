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
 * Format date values
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Format date for display in short format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string (MMM DD, YYYY)
 */
const formatDateShort = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Generate invoice number with padding
 * @param {string} prefix - Invoice prefix
 * @param {number} number - Invoice number
 * @param {number} padding - Number of digits to pad (default: 5)
 * @returns {string} Formatted invoice number
 */
const generateInvoiceNumber = (prefix, number, padding = 5) => {
  return `${prefix}-${String(number).padStart(padding, '0')}`;
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

module.exports = {
  formatCurrency,
  formatDate,
  formatDateShort,
  generateInvoiceNumber,
  calculateInvoiceTotals,
  isValidEmail,
  sanitizeString
};
