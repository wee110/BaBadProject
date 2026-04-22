# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: golden_path.spec.js >> 🏆 Phase 4: Golden Path UI Tests >> TC-04: Admin Approval Workflow
- Location: tests\e2e\golden_path.spec.js:62:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.alert-success').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.alert-success').first()

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
        - link "➕ เพิ่มสนาม" [ref=e11] [cursor=pointer]:
          - /url: /rooms/add
        - generic [ref=e12]:
          - generic [ref=e13]: A
          - generic [ref=e14]:
            - generic [ref=e15]: admin
            - generic [ref=e16]: admin
        - link "🚪 ออก" [ref=e17] [cursor=pointer]:
          - /url: /logout
  - generic [ref=e19]:
    - generic [ref=e20]:
      - heading "➕ เพิ่มสนามใหม่" [level=1] [ref=e21]
      - paragraph [ref=e22]: กรอกข้อมูลสนามแบดมินตันที่ต้องการเพิ่ม
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]: 🏸 ชื่อสนาม
        - textbox "เช่น สนาม G" [ref=e27]
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]: 👥 ประเภทสนาม
          - combobox [ref=e31]:
            - option "คู่ (Double)" [selected]
            - option "เดี่ยว (Single)"
        - generic [ref=e32]:
          - generic [ref=e33]: 🏗️ พื้นสนาม
          - combobox [ref=e34]:
            - option "สังเคราะห์ (Synthetic)" [selected]
            - option "ไม้ (Wooden)"
            - option "ซีเมนต์ (Cement)"
      - generic [ref=e35]:
        - generic [ref=e36]: 💰 ราคาต่อชั่วโมง (บาท)
        - spinbutton [ref=e37]: "200"
      - generic [ref=e38]:
        - generic [ref=e39]: 📝 คำอธิบาย
        - textbox "คำอธิบายสนาม (ไม่บังคับ)" [ref=e40]
      - generic [ref=e41]:
        - generic [ref=e42]: 🏢 สิ่งอำนวยความสะดวก
        - generic [ref=e43]:
          - generic [ref=e44] [cursor=pointer]:
            - checkbox "💡 ไฟส่องสว่าง" [ref=e45]
            - text: 💡 ไฟส่องสว่าง
          - generic [ref=e46] [cursor=pointer]:
            - checkbox "❄️ แอร์" [ref=e47]
            - text: ❄️ แอร์
          - generic [ref=e48] [cursor=pointer]:
            - checkbox "🚿 ห้องอาบน้ำ" [ref=e49]
            - text: 🚿 ห้องอาบน้ำ
          - generic [ref=e50] [cursor=pointer]:
            - checkbox "🅿️ ที่จอดรถ" [ref=e51]
            - text: 🅿️ ที่จอดรถ
          - generic [ref=e52] [cursor=pointer]:
            - checkbox "📺 จอ Scoreboard" [ref=e53]
            - text: 📺 จอ Scoreboard
          - generic [ref=e54] [cursor=pointer]:
            - checkbox "🧴 ล็อกเกอร์" [ref=e55]
            - text: 🧴 ล็อกเกอร์
      - generic [ref=e56]:
        - generic [ref=e57]: 👁️ ตัวอย่างสนาม
        - generic [ref=e58]:
          - generic [ref=e60]: 🏸
          - generic [ref=e61]:
            - generic [ref=e62]: สนามใหม่
            - generic [ref=e63]:
              - generic [ref=e64]: 👥 คู่
              - generic [ref=e65]: 🟢 สังเคราะห์
            - generic [ref=e66]: ฿200 / ชั่วโมง
            - paragraph [ref=e67]: "-"
      - generic [ref=e68]:
        - button "✅ เพิ่มสนาม" [ref=e69] [cursor=pointer]
        - link "ยกเลิก" [ref=e70] [cursor=pointer]:
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
  54 |     await page.waitForURL('**/dashboard');
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
> 75 |       await expect(successAlert.first()).toBeVisible();
     |                                          ^ Error: expect(locator).toBeVisible() failed
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