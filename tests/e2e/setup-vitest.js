import puppeteer from 'puppeteer';
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global variables for tests
let browser;
let page;

// Make browser and page available globally
global.browser = null;
global.page = null;

beforeAll(async () => {
  // Launch browser
  browser = await puppeteer.launch({
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 0,
    devtools: process.env.DEVTOOLS === 'true',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080'
    ],
  });
  
  global.browser = browser;
});

beforeEach(async () => {
  // Create new page for each test
  page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Set default timeouts
  page.setDefaultNavigationTimeout(10000);
  page.setDefaultTimeout(5000);
  
  global.page = page;
});

afterEach(async () => {
  // Clear cookies
  const cookies = await page.cookies();
  if (cookies.length > 0) {
    await page.deleteCookie(...cookies);
  }
  
  // Clear local storage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  }).catch(() => {
    // Page might be closed or navigated away
  });
  
  // Close page
  await page.close().catch(() => {
    // Page might already be closed
  });
});

afterAll(async () => {
  // Close browser
  if (browser) {
    await browser.close();
  }
});
