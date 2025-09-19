/**
 * E2E Test Helpers for Invoice Management App
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';

/**
 * Navigate to a specific path
 * @param {Page} page - Puppeteer page instance
 * @param {string} path - Path to navigate to
 */
const navigateTo = async (page, path = '') => {
  await page.goto(`${BASE_URL}${path}`, {
    waitUntil: 'networkidle0',
  });
};

/**
 * Wait for element and click
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Element selector
 * @param {Object} options - Click options
 */
const waitAndClick = async (page, selector, options = {}) => {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector, options);
};

/**
 * Wait for element and type
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Element selector
 * @param {string} text - Text to type
 * @param {Object} options - Type options
 */
const waitAndType = async (page, selector, text, options = {}) => {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector, { clickCount: 3 }); // Select all existing text
  await page.type(selector, text, options);
};

/**
 * Clear input field and type new text
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Element selector
 * @param {string} text - Text to type
 */
const clearAndType = async (page, selector, text) => {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector, { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type(selector, text);
};

/**
 * Wait for navigation after an action
 * @param {Page} page - Puppeteer page instance
 * @param {Function} action - Action that triggers navigation
 */
const waitForNavigation = async (page, action) => {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    action()
  ]);
};

/**
 * Check if element exists
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Element selector
 * @returns {boolean} - True if element exists
 */
const elementExists = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
};

/**
 * Get element text content
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Element selector
 * @returns {string} - Element text content
 */
const getElementText = async (page, selector) => {
  await page.waitForSelector(selector);
  return await page.$eval(selector, el => el.textContent.trim());
};

/**
 * Wait for element to disappear
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
const waitForElementToDisappear = async (page, selector, timeout = 5000) => {
  await page.waitForFunction(
    sel => !document.querySelector(sel),
    { timeout },
    selector
  );
};

/**
 * Take screenshot with descriptive name
 * @param {Page} page - Puppeteer page instance
 * @param {string} name - Screenshot name
 */
const takeScreenshot = async (page, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `tests/e2e/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
};

/**
 * Wait for toast message to appear
 * @param {Page} page - Puppeteer page instance
 * @param {string} expectedText - Expected toast text
 */
const waitForToast = async (page, expectedText) => {
  // Wait for react-hot-toast container
  await page.waitForSelector('[class*="Toastify"], [class*="toast"]', { visible: true });
  
  // Check if expected text appears
  if (expectedText) {
    await page.waitForFunction(
      text => {
        const toasts = document.querySelectorAll('[class*="Toastify"], [class*="toast"]');
        return Array.from(toasts).some(toast => toast.textContent.includes(text));
      },
      {},
      expectedText
    );
  }
};

/**
 * Fill form field by label
 * @param {Page} page - Puppeteer page instance
 * @param {string} labelText - Label text
 * @param {string} value - Value to fill
 */
const fillFormFieldByLabel = async (page, labelText, value) => {
  // Find the label
  const labelHandle = await page.$x(`//label[contains(text(), "${labelText}")]`);
  if (labelHandle.length === 0) {
    throw new Error(`Label with text "${labelText}" not found`);
  }
  
  // Get the 'for' attribute
  const forAttribute = await page.evaluate(el => el.getAttribute('for'), labelHandle[0]);
  
  if (forAttribute) {
    // Use the ID to find the input
    await clearAndType(page, `#${forAttribute}`, value);
  } else {
    // Find the input within the label or next to it
    const input = await page.evaluateHandle(
      el => el.querySelector('input, textarea') || el.nextElementSibling,
      labelHandle[0]
    );
    await input.click({ clickCount: 3 });
    await input.type(value);
  }
};

export {
  BASE_URL,
  navigateTo,
  waitAndClick,
  waitAndType,
  clearAndType,
  waitForNavigation,
  elementExists,
  getElementText,
  waitForElementToDisappear,
  takeScreenshot,
  waitForToast,
  fillFormFieldByLabel,
};
