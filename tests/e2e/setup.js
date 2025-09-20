// Global test setup
beforeAll(async () => {
  // Set viewport size for consistent testing
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Configure default navigation options
  page.setDefaultNavigationTimeout(10000);
  page.setDefaultTimeout(5000);
});

// Clear browser state between tests
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
  });
  
  // Take screenshot on test failure
  if (global.jasmine && global.jasmine.currentTest && global.jasmine.currentTest.failedExpectations.length > 0) {
    const testName = global.jasmine.currentTest.fullName.replace(/\s+/g, '-').toLowerCase();
    await page.screenshot({
      path: `tests/e2e/screenshots/failed-${testName}-${Date.now()}.png`,
      fullPage: true
    });
  }
});

// Close page after all tests
afterAll(async () => {
  await page.close();
});
