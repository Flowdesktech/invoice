# E2E Testing with Vitest and Puppeteer

This directory contains end-to-end (E2E) tests for the Invoice Management application using Vitest and Puppeteer.

## 📋 Prerequisites

- Node.js 16+ installed
- Chrome or Chromium browser installed
- No need to manually start the dev server - tests will start it automatically!

## 🚀 Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests in headless mode (no browser window)
```bash
npm run test:e2e:headless
```

### Run tests in debug mode (slow motion, with DevTools)
```bash
npm run test:e2e:debug
```

### Run specific test suites
```bash
# Landing page tests only
npm run test:e2e:landing

# Login flow tests only
npm run test:e2e:login

# Signup flow tests only
npm run test:e2e:signup
```

### Watch mode (re-runs on file changes)
```bash
npm run test:e2e:watch
```

### Run tests with Vitest UI
```bash
npm run test:e2e:ui
```

### CI/CD mode (optimized for continuous integration)
```bash
npm run test:e2e:ci
```

## 🏗️ Test Structure

```
tests/e2e/
├── helpers/
│   ├── testHelpers.js      # Common utility functions
│   └── testData.js         # Test data and constants
├── specs/
│   ├── landing.test.js     # Landing page tests
│   ├── login.test.js       # Login flow tests
│   └── signup.test.js      # Signup flow tests
├── screenshots/            # Failed test screenshots
├── setup.js               # Global test setup
└── puppeteerEnvironment.js # Custom Puppeteer environment
```

## 🛠️ Configuration

### Environment Variables

- `TEST_URL` - Base URL for tests (default: `http://localhost:5173`)
- `HEADLESS` - Run in headless mode (`true`/`false`)
- `SLOWMO` - Slow down Puppeteer operations by specified milliseconds
- `DEVTOOLS` - Open Chrome DevTools automatically (`true`/`false`)

### Jest Configuration (`jest.config.js`)
- Test timeout: 30 seconds
- Test pattern: `**/tests/e2e/**/*.test.js`
- Environment: Custom Puppeteer environment

### Puppeteer Configuration (`jest-puppeteer.config.js`)
- Browser window size: 1920x1080
- Automatic server start on port 5173
- Headless mode by default

## 📝 Writing New Tests

### Basic Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(async () => {
    await navigateTo(page, '/path');
  });

  test('should do something', async () => {
    // Arrange
    const selector = 'button[type="submit"]';
    
    // Act
    await waitAndClick(page, selector);
    
    // Assert
    await expect(page).toMatchElement('h1', { text: 'Success' });
  });
});
```

### Available Helper Functions

#### Navigation
- `navigateTo(page, path)` - Navigate to a specific path
- `waitForNavigation(page, action)` - Wait for navigation after an action

#### Interactions
- `waitAndClick(page, selector)` - Wait for element and click
- `waitAndType(page, selector, text)` - Wait for element and type
- `clearAndType(page, selector, text)` - Clear field and type
- `fillFormFieldByLabel(page, labelText, value)` - Fill form field by label

#### Assertions
- `elementExists(page, selector)` - Check if element exists
- `getElementText(page, selector)` - Get element text content
- `waitForElementToDisappear(page, selector)` - Wait for element removal
- `waitForToast(page, expectedText)` - Wait for toast notification

#### Utilities
- `takeScreenshot(page, name)` - Capture screenshot
- `generateTestEmail()` - Generate unique test email
- `generateTestUser()` - Generate test user data

## 📸 Screenshots

- Failed tests automatically capture screenshots
- Screenshots are saved to `tests/e2e/screenshots/`
- Format: `failed-{test-name}-{timestamp}.png`
- Manual screenshots: `await takeScreenshot(page, 'feature-name')`

## 🔍 Debugging Tests

### Visual Debugging
```bash
# Run with browser visible and slow motion
npm run test:e2e:debug
```

### Console Logs
```javascript
// Log from browser context
await page.evaluate(() => console.log('Browser log'));

// Log from test context
console.log('Test log');
```

### Pause Execution
```javascript
// Pause test execution
await page.waitForTimeout(5000); // Wait 5 seconds
await page.pause(); // Pause until manually resumed (debug mode)
```

## 🎯 Best Practices

1. **Keep tests independent** - Each test should be able to run in isolation
2. **Use descriptive test names** - Clearly describe what the test verifies
3. **Clean up between tests** - Clear cookies, localStorage, and sessionStorage
4. **Use data-testid attributes** - Add test IDs to make elements easy to select
5. **Avoid hard-coded waits** - Use `waitForSelector` instead of `waitForTimeout`
6. **Handle async operations** - Always await Puppeteer operations
7. **Test user journeys** - Focus on real user workflows, not implementation details

## 🐛 Common Issues

### "Element not found" errors
- Check if element is in viewport: `await page.evaluate(() => element.scrollIntoView())`
- Wait for element: `await page.waitForSelector(selector, { visible: true })`
- Check if element is in iframe or shadow DOM

### Timeout errors
- Increase timeout: `await page.waitForSelector(selector, { timeout: 10000 })`
- Check if page is loading: `await page.waitForLoadState('networkidle')`
- Verify server is running on expected port

### Flaky tests
- Add explicit waits: `await page.waitForSelector()`
- Use `waitForFunction` for complex conditions
- Check for race conditions in async operations

## 📊 Test Coverage

Current test coverage includes:

### Landing Page
- ✅ Page layout and content
- ✅ Navigation to login/signup
- ✅ Feature sections display
- ✅ Footer links
- ✅ Mobile responsiveness

### Login Flow
- ✅ Form validation
- ✅ Error handling
- ✅ Password visibility toggle
- ✅ Navigation to forgot password
- ✅ Loading states

### Signup Flow
- ✅ Form validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Terms and conditions
- ✅ Social signup options
- ✅ Keyboard accessibility

## 🚧 Future Improvements

- [ ] Add tests for authenticated features (dashboard, invoices)
- [ ] Implement visual regression testing
- [ ] Add performance metrics collection
- [ ] Create test data fixtures
- [ ] Add API mocking for consistent tests
- [ ] Implement parallel test execution
- [ ] Add accessibility (a11y) tests
- [ ] Create custom Puppeteer commands

## 📚 Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Jest-Puppeteer](https://github.com/smooth-code/jest-puppeteer)
- [Writing E2E Tests Best Practices](https://docs.cypress.io/guides/references/best-practices)
