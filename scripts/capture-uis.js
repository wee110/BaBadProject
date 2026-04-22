const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function capture() {
  const screenshotDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  console.log('🚀 Starting UI Capture...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    // 1. Capture Login Page
    console.log('📸 Capturing Login Page...');
    await page.goto('http://localhost:3000/login');
    await page.screenshot({ path: path.join(screenshotDir, '01_login_page.png'), fullPage: true });

    // 2. Login
    console.log('🔑 Logging in as User1...');
    await page.fill('input[name="username"]', 'user1');
    await page.fill('input[name="password"]', '1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 3. Capture Dashboard
    console.log('📸 Capturing Dashboard...');
    await page.screenshot({ path: path.join(screenshotDir, '02_dashboard.png'), fullPage: true });

    // 4. Capture Search Page
    console.log('📸 Capturing Search Page...');
    await page.goto('http://localhost:3000/search');
    await page.screenshot({ path: path.join(screenshotDir, '03_search_page.png'), fullPage: true });

    // 5. Capture Booking Page (Court 1)
    console.log('📸 Capturing Booking Page...');
    await page.goto('http://localhost:3000/book/1');
    await page.screenshot({ path: path.join(screenshotDir, '04_booking_page.png'), fullPage: true });

    // 6. Capture Calendar
    console.log('📸 Capturing Calendar...');
    await page.goto('http://localhost:3000/calendar');
    await page.screenshot({ path: path.join(screenshotDir, '05_calendar_page.png'), fullPage: true });

    console.log('✅ Done! All screenshots saved in /screenshots folder.');
  } catch (error) {
    console.error('❌ Error during capture:', error);
  } finally {
    await browser.close();
  }
}

capture();
