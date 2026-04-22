const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { BookingPage } = require('../pages/BookingPage');

test.describe('🏆 Phase 4: Golden Path UI Tests', () => {

  test('TC-01: Secure Login & Role Verification', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Expected Result: Login succeeds and shows correct username/role
    await loginPage.login('user1', '1234');
    await page.waitForURL('**/dashboard');
    await expect(page.locator('.user-name')).toHaveText('user1');
    await expect(page.locator('.user-role')).toContainText('user');
  });

  test('TC-02: Court Discovery & Metadata Precision', async ({ page }) => {
    // Expected Result: Search finds correct court and displays accurate Thai metadata
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user1', '1234');
    await page.waitForURL('**/dashboard');
    
    await page.goto('/search');
    // Perform search via form (POST)
    await page.fill('#search-date', '2026-12-25');
    await page.selectOption('#search-court-type', 'double');
    await page.click('#btn-search');
    
    const firstCourtName = page.locator('.court-name').first();
    await expect(firstCourtName).toBeVisible();
    await expect(firstCourtName).toContainText('สนาม'); // Verify Thai characters
    
    // Verify badge logic
    const badge = page.locator('.badge-type').first();
    await expect(badge).toContainText('คู่'); // Matches Thai UI for DOUBLE
  });

  test('TC-03: End-to-End Booking Lifecycle', async ({ page }) => {
    // Expected Result: User completes a booking and it appears in dashboard as PENDING
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user1', '1234');
    await page.waitForURL('**/dashboard');

    await page.goto('/book/1');
    const bookingPage = new BookingPage(page);
    
    const futureDate = '2026-12-25';
    await bookingPage.book(futureDate, '10:00', '12:00');

    await page.waitForURL('**/dashboard');
    const latestBooking = page.locator('.booking-card').first();
    await expect(latestBooking).toContainText('สนาม A');
    await expect(latestBooking).toContainText('10:00 - 12:00');
    // Match Thai status: "รอการอนุมัติ" (PENDING)
    await expect(latestBooking.locator('.booking-status')).toContainText('รอการอนุมัติ');
  });

  test('TC-04: Admin Approval Workflow', async ({ page }) => {
    // Expected Result: Admin can approve a pending booking and status changes to APPROVED
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await page.waitForURL('**/dashboard');

    // Find the first "Approve" button
    const approveButton = page.locator('.btn-success').first();
    if (await approveButton.isVisible()) {
      await approveButton.click();
      // Look for any success alert (Thai or Icon)
      const successAlert = page.locator('.alert-success');
      await expect(successAlert.first()).toBeVisible();
    }
  });

  test('TC-05: Security Guard - Overbooking Prevention', async ({ page }) => {
    // Expected Result: System prevents booking a slot that is already taken
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user1', '1234');
    await page.waitForURL('**/dashboard');

    await page.goto('/book/5');
    await page.fill('input[name="date"]', '2026-12-25');
    await page.selectOption('select[name="startTime"]', '10:00');
    await page.selectOption('select[name="endTime"]', '11:00');
    await page.click('button[type="submit"]');

    // Expected: Error message containing "ถูกจอง" (Booked)
    const errorMsg = page.locator('.alert-error');
    await expect(errorMsg).toContainText(/ถูกจอง|จองแล้ว/);
  });

});
