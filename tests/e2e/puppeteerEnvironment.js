import PuppeteerEnvironment from 'jest-environment-puppeteer';

class CustomPuppeteerEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();
    // Custom setup can be added here
  }

  async teardown() {
    // Custom teardown can be added here
    await super.teardown();
  }
}

export default CustomPuppeteerEnvironment;
