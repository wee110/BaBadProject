# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: golden_path.spec.js >> 🏆 Phase 4: Golden Path UI Tests >> TC-03: End-to-End Booking Lifecycle
- Location: tests\e2e\golden_path.spec.js:41:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "🏸 BaBadminton" [ref=e4] [cursor=pointer]:
        - /url: /dashboard
        - generic [ref=e5]: 🏸
        - generic [ref=e6]: BaBadminton
      - generic [ref=e7]:
        - link "📊 Dashboard" [ref=e8] [cursor=pointer]:
          - /url: /dashboard
        - link "🔍 ค้นหาสนาม" [ref=e9] [cursor=pointer]:
          - /url: /search
        - link "📅 ปฏิทิน" [ref=e10] [cursor=pointer]:
          - /url: /calendar
        - generic [ref=e11]:
          - generic [ref=e12]: U
          - generic [ref=e13]:
            - generic [ref=e14]: user1
            - generic [ref=e15]: user
        - link "🚪 ออก" [ref=e16] [cursor=pointer]:
          - /url: /logout
  - generic [ref=e18]:
    - generic [ref=e19]:
      - heading "📝 จองสนาม" [level=1] [ref=e20]
      - paragraph [ref=e21]: เลือกวันที่และเวลาที่ต้องการ
    - generic [ref=e22]:
      - generic [ref=e23]: 🏸
      - generic [ref=e24]:
        - heading "สนาม A" [level=2] [ref=e25]
        - generic [ref=e26]:
          - generic [ref=e27]: 👥 คู่
          - generic [ref=e28]: 🟢 สังเคราะห์
        - generic [ref=e29]: ฿200 / ชั่วโมง
        - paragraph [ref=e30]: สนามแบดมินตันคู่ พื้นสังเคราะห์คุณภาพสูง พร้อมระบบแอร์
        - generic [ref=e31]:
          - generic [ref=e32]: 💡 ไฟส่องสว่าง
          - generic [ref=e33]: ❄️ แอร์
          - generic [ref=e34]: 🅿️ ที่จอดรถ
    - generic [ref=e35]: ⚠️ ⚠️ สนามนี้ถูกจองในช่วงเวลานี้แล้ว กรุณาเลือกเวลาอื่น
    - generic [ref=e36]:
      - heading "📅 เลือกวันและเวลา" [level=3] [ref=e37]
      - paragraph [ref=e38]: ⏰ เปิดให้บริการ 06:00 - 22:00 | ขั้นต่ำ 1 ชั่วโมง
      - generic [ref=e39]:
        - generic [ref=e41]:
          - generic [ref=e42]: 📅 วันที่
          - textbox [ref=e43]
        - generic [ref=e44]:
          - generic [ref=e45]:
            - generic [ref=e46]: 🕐 เวลาเริ่ม
            - combobox [ref=e47]:
              - option "06:00" [selected]
              - option "06:30"
              - option "07:00"
              - option "07:30"
              - option "08:00"
              - option "08:30"
              - option "09:00"
              - option "09:30"
              - option "10:00"
              - option "10:30"
              - option "11:00"
              - option "11:30"
              - option "12:00"
              - option "12:30"
              - option "13:00"
              - option "13:30"
              - option "14:00"
              - option "14:30"
              - option "15:00"
              - option "15:30"
              - option "16:00"
              - option "16:30"
              - option "17:00"
              - option "17:30"
              - option "18:00"
              - option "18:30"
              - option "19:00"
              - option "19:30"
              - option "20:00"
              - option "20:30"
              - option "21:00"
              - option "21:30"
          - generic [ref=e48]:
            - generic [ref=e49]: 🕐 เวลาสิ้นสุด
            - combobox [ref=e50]:
              - option "07:00" [selected]
              - option "07:30"
              - option "08:00"
              - option "08:30"
              - option "09:00"
              - option "09:30"
              - option "10:00"
              - option "10:30"
              - option "11:00"
              - option "11:30"
              - option "12:00"
              - option "12:30"
              - option "13:00"
              - option "13:30"
              - option "14:00"
              - option "14:30"
              - option "15:00"
              - option "15:30"
              - option "16:00"
              - option "16:30"
              - option "17:00"
              - option "17:30"
              - option "18:00"
              - option "18:30"
              - option "19:00"
              - option "19:30"
              - option "20:00"
              - option "20:30"
              - option "21:00"
              - option "21:30"
              - option "22:00"
        - generic [ref=e51]:
          - button "✅ ยืนยันการจอง" [ref=e52] [cursor=pointer]
          - link "ยกเลิก" [ref=e53] [cursor=pointer]:
            - /url: /dashboard
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { LoginPage } = require('../pages/LoginPage');
  3  | const { DashboardPage } = require('../pages/DashboardPage');
  4  | const { BookingPage } = require('../pages/BookingPage');
  5  | 
  6  | test.describe('🏆 Phase 4: Golden Path UI Tests', () => {
  7  | 
  8  |   test('TC-01: Secure Login & Role Verification', async ({ page }) => {
  9  |     const loginPage = new LoginPage(page);
  10 |     await loginPage.goto();
  11 |     
  12 |     // Expected Result: Login succeeds and shows correct username/role
  13 |     await loginPage.login('user1', '1234');
  14 |     await page.waitForURL('**/dashboard');
  15 |     await expect(page.locator('.user-name')).toHaveText('user1');
  16 |     await expect(page.locator('.user-role')).toContainText('user');
  17 |   });
  18 | 
  19 |   test('TC-02: Court Discovery & Metadata Precision', async ({ page }) => {
  20 |     // Expected Result: Search finds correct court and displays accurate Thai metadata
  21 |     const loginPage = new LoginPage(page);
  22 |     await loginPage.goto();
  23 |     await loginPage.login('user1', '1234');
  24 |     await page.waitForURL('**/dashboard');
  25 |     
  26 |     await page.goto('/search');
  27 |     // Perform search via form (POST)
  28 |     await page.fill('#search-date', '2026-12-25');
  29 |     await page.selectOption('#search-court-type', 'double');
  30 |     await page.click('#btn-search');
  31 |     
  32 |     const firstCourtName = page.locator('.court-name').first();
  33 |     await expect(firstCourtName).toBeVisible();
  34 |     await expect(firstCourtName).toContainText('สนาม'); // Verify Thai characters
  35 |     
  36 |     // Verify badge logic
  37 |     const badge = page.locator('.badge-type').first();
  38 |     await expect(badge).toContainText('คู่'); // Matches Thai UI for DOUBLE
  39 |   });
  40 | 
  41 |   test('TC-03: End-to-End Booking Lifecycle', async ({ page }) => {
  42 |     // Expected Result: User completes a booking and it appears in dashboard as PENDING
  43 |     const loginPage = new LoginPage(page);
  44 |     await loginPage.goto();
  45 |     await loginPage.login('user1', '1234');
  46 |     await page.waitForURL('**/dashboard');
  47 | 
  48 |     await page.goto('/book/1');
  49 |     const bookingPage = new BookingPage(page);
  50 |     
  51 |     const futureDate = '2026-12-25';
  52 |     await bookingPage.book(futureDate, '10:00', '12:00');
  53 | 
> 54 |     await page.waitForURL('**/dashboard');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  55 |     const latestBooking = page.locator('.booking-card').first();
  56 |     await expect(latestBooking).toContainText('สนาม A');
  57 |     await expect(latestBooking).toContainText('10:00 - 12:00');
  58 |     // Match Thai status: "รอการอนุมัติ" (PENDING)
  59 |     await expect(latestBooking.locator('.booking-status')).toContainText('รอการอนุมัติ');
  60 |   });
  61 | 
  62 |   test('TC-04: Admin Approval Workflow', async ({ page }) => {
  63 |     // Expected Result: Admin can approve a pending booking and status changes to APPROVED
  64 |     const loginPage = new LoginPage(page);
  65 |     await loginPage.goto();
  66 |     await loginPage.login('admin', 'admin123');
  67 |     await page.waitForURL('**/dashboard');
  68 | 
  69 |     // Find the first "Approve" button
  70 |     const approveButton = page.locator('.btn-success').first();
  71 |     if (await approveButton.isVisible()) {
  72 |       await approveButton.click();
  73 |       // Look for any success alert (Thai or Icon)
  74 |       const successAlert = page.locator('.alert-success');
  75 |       await expect(successAlert.first()).toBeVisible();
  76 |     }
  77 |   });
  78 | 
  79 |   test('TC-05: Security Guard - Overbooking Prevention', async ({ page }) => {
  80 |     // Expected Result: System prevents booking a slot that is already taken
  81 |     const loginPage = new LoginPage(page);
  82 |     await loginPage.goto();
  83 |     await loginPage.login('user1', '1234');
  84 |     await page.waitForURL('**/dashboard');
  85 | 
  86 |     await page.goto('/book/5');
  87 |     await page.fill('input[name="date"]', '2026-12-25');
  88 |     await page.selectOption('select[name="startTime"]', '10:00');
  89 |     await page.selectOption('select[name="endTime"]', '11:00');
  90 |     await page.click('button[type="submit"]');
  91 | 
  92 |     // Expected: Error message containing "ถูกจอง" (Booked)
  93 |     const errorMsg = page.locator('.alert-error');
  94 |     await expect(errorMsg).toContainText(/ถูกจอง|จองแล้ว/);
  95 |   });
  96 | 
  97 | });
  98 | 
```