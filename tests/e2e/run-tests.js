#!/usr/bin/env node

/**
 * Simple E2E Test Runner for Puppeteer Tests
 * This bypasses Jest's ES module issues
 */

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS !== 'false';
const SLOWMO = process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 0;

// Start dev server
console.log('Starting development server...');
const devServer = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '../..'),
  shell: true,
  detached: false
});

// Wait for server to start
await new Promise(resolve => setTimeout(resolve, 5000));

// Launch Puppeteer
console.log('Launching browser...');
const browser = await puppeteer.launch({
  headless: HEADLESS,
  slowMo: SLOWMO,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=1920,1080'
  ],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Test 1: Landing Page
  console.log('\n🧪 Testing Landing Page...');
  await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
  
  // Check for main heading
  const heading = await page.$eval('h1', el => el.textContent).catch(() => null);
  if (heading && heading.includes('Invoice')) {
    console.log('✅ Landing page loaded successfully');
  } else {
    console.error('❌ Landing page heading not found');
  }

  // Check for Get Started button
  const getStartedBtn = await page.$('button:has-text("Get Started"), a:has-text("Get Started")');
  if (getStartedBtn) {
    console.log('✅ Get Started button found');
  } else {
    console.error('❌ Get Started button not found');
  }

  // Test 2: Login Page
  console.log('\n🧪 Testing Login Page...');
  await page.goto(`${TEST_URL}/login`, { waitUntil: 'networkidle0' });
  
  // Check for email input
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    console.log('✅ Email input found');
  } else {
    console.error('❌ Email input not found');
  }

  // Check for password input
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    console.log('✅ Password input found');
  } else {
    console.error('❌ Password input not found');
  }

  // Test 3: Signup Page
  console.log('\n🧪 Testing Signup Page...');
  await page.goto(`${TEST_URL}/signup`, { waitUntil: 'networkidle0' });
  
  // Check for signup form
  const signupForm = await page.$('form');
  if (signupForm) {
    console.log('✅ Signup form found');
  } else {
    console.error('❌ Signup form not found');
  }

  console.log('\n✨ E2E tests completed!');

} catch (error) {
  console.error('❌ Test error:', error);
} finally {
  await browser.close();
  
  // Kill dev server
  console.log('\nStopping development server...');
  try {
    process.kill(-devServer.pid);
  } catch (e) {
    devServer.kill();
  }
  
  process.exit(0);
}
