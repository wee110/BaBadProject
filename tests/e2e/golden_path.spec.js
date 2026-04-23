const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { BookingPage } = require('../pages/BookingPage');
const { removeTestBooking } = require('../utils/db');

test.describe('🏆 Phase 4: Golden Path UI Tests', () => {

  test.beforeAll(async () => {
    // Ensure clean state for the test date to prevent overbooking timeouts
    // user1 ID in seeded data is 2
    await removeTestBooking(2, '2026-12-25');
  });
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

    // Find a pending booking card
    const bookingCard = page.locator('.booking-card', { hasText: 'รอการอนุมัติ' }).first();

    if (await bookingCard.isVisible()) {
      const bookingId = await bookingCard.getAttribute('id');
      const approveButton = bookingCard.locator('.btn-success');

      await approveButton.click();

      // Wait for dashboard to reload
      await page.waitForURL('**/dashboard');

      // Verify status changes to "อนุมัติแล้ว" (Approved) for THAT specific booking
      const updatedCard = page.locator(`#${bookingId}`);
      await expect(updatedCard.locator('.booking-status')).toContainText('อนุมัติแล้ว');
    }
  });

  test('TC-05: Security Guard - Overbooking Prevention', async ({ page }) => {
    // Expected Result: System prevents booking a slot that is already taken
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user1', '1234');
    await page.waitForURL('**/dashboard');

    // 1. Create a booking first to create a conflict
    await page.goto('/book/5');
    await page.fill('input[name="date"]', '2026-12-25');
    await page.selectOption('select[name="startTime"]', '14:00');
    await page.selectOption('select[name="endTime"]', '15:00');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 2. Try to book the EXACT same slot again
    await page.goto('/book/5');
    await page.fill('input[name="date"]', '2026-12-25');
    await page.selectOption('select[name="startTime"]', '14:00');
    await page.selectOption('select[name="endTime"]', '15:00');
    await page.click('button[type="submit"]');

    // Expected: Error message containing "ถูกจอง" (Booked)
    const errorMsg = page.locator('.alert-error');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText(/ถูกจอง|จองแล้ว/);
  });

});
