/**
 * Vitest-compatible helpers for Puppeteer E2E tests
 */

import { expect } from 'vitest';

/**
 * Wait for an element with specific text content
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Base selector (e.g., 'button', 'a', 'h1')
 * @param {string} text - Text to search for
 * @param {Object} options - Additional options
 * @returns {ElementHandle} - The found element
 */
export const waitForElementWithText = async (page, selector, text, options = {}) => {
  const { timeout = 5000, visible = true } = options;
  
  try {
    await page.waitForFunction(
      (sel, txt) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements).some(el => 
          el.textContent && el.textContent.includes(txt)
        );
      },
      { timeout },
      selector,
      text
    );
    
    // Find and return the element
    const element = await page.evaluateHandle((sel, txt) => {
      const elements = document.querySelectorAll(sel);
      return Array.from(elements).find(el => 
        el.textContent && el.textContent.includes(txt)
      );
    }, selector, text);
    
    return element;
  } catch (error) {
    throw new Error(`Element with selector "${selector}" containing text "${text}" not found`);
  }
};

/**
 * Check if an element with specific text exists
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Base selector
 * @param {string} text - Text to search for
 * @returns {boolean} - True if element exists
 */
export const elementWithTextExists = async (page, selector, text) => {
  const exists = await page.evaluate((sel, txt) => {
    const elements = document.querySelectorAll(sel);
    return Array.from(elements).some(el => 
      el.textContent && el.textContent.includes(txt)
    );
  }, selector, text);
  
  return exists;
};

/**
 * Click an element with specific text
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Base selector
 * @param {string} text - Text to search for
 */
export const clickElementWithText = async (page, selector, text) => {
  const element = await waitForElementWithText(page, selector, text);
  await element.click();
};

/**
 * Extended expect function for Puppeteer elements
 * @param {Page} page - Puppeteer page instance
 * @returns {Object} - Object with custom matchers
 */
export const expectPage = (page) => {
  return {
    async toHaveText(selector, expectedText) {
      const actualText = await page.$eval(selector, el => el.textContent?.trim() || '');
      expect(actualText).toContain(expectedText);
    },
    
    async toHaveElement(selector) {
      const element = await page.$(selector);
      expect(element).toBeTruthy();
    },
    
    async toHaveElementWithText(selector, text) {
      const exists = await elementWithTextExists(page, selector, text);
      expect(exists).toBe(true);
    },
    
    async toHaveUrl(expectedUrl) {
      const actualUrl = page.url();
      if (expectedUrl instanceof RegExp) {
        expect(actualUrl).toMatch(expectedUrl);
      } else {
        expect(actualUrl).toContain(expectedUrl);
      }
    },
    
    async toHaveTitle(expectedTitle) {
      const actualTitle = await page.title();
      if (expectedTitle instanceof RegExp) {
        expect(actualTitle).toMatch(expectedTitle);
      } else {
        expect(actualTitle).toContain(expectedTitle);
      }
    }
  };
};

/**
 * Wait for navigation and return the new URL
 * @param {Page} page - Puppeteer page instance
 * @param {Function} action - Action that triggers navigation
 * @returns {string} - New URL after navigation
 */
export const waitForNavigationAndGetUrl = async (page, action) => {
  const [response] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    action()
  ]);
  return page.url();
};
