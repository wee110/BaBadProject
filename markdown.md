# 🏸 BaBadminton Court Booking System
> **ระบบจองสนามแบดมินตันออนไลน์ที่ครบวงจร สะดวก รวดเร็ว และเป็นมืออาชีพ**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Passport](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)

---

## 🌟 ภาพรวมของโปรเจกต์
ในปัจจุบันการออกกำลังกายได้รับความนิยมสูงขึ้นมาก โดยเฉพาะกีฬาแบดมินตัน แต่ปัญหาที่มักพบคือ **ความยุ่งยากในการจองสนาม** ระบบนี้จึงถูกพัฒนาขึ้นเพื่อแก้ปัญหานั้น โดยเน้นที่ความเรียบง่ายในการตรวจสอบสนามว่าง และความรวดเร็วในการจอง

## ✨ ฟีเจอร์เด่น (Key Features)

### 👤 สำหรับผู้ใช้งาน / ลูกค้า
*   **ตรวจสอบสนามว่างแบบ Real-time**: เลือกวันและเพื่อดูสนามที่ว่างได้ทันที
*   **ระบบจองที่ง่ายดาย**: ระบุจำนวนผู้เล่นและข้อมูลติดต่อได้อย่างรวดเร็ว
*   **ระบบชำระเงิน**: รองรับการตรวจสอบสถานะการชำระเงิน
*   **จัดการการจอง**: ดูประวัติการจองของตนเอง และสามารถยกเลิกการจองได้ก่อนถึงเวลา

### 👨‍💼 สำหรับผู้ดูแลสนาม (Admin)
*   **Dashboard สรุปข้อมูล**: ตรวจสอบรายการจองทั้งหมดในระบบ
*   **จัดการสถานะการชำระเงิน**: ยืนยันเมื่อลูกค้าชำระเงินแล้ว
*   **จัดการสนาม**: เพิ่มหรือแก้ไขข้อมูลสนามแบดมินตันในระบบ

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **View Engine**: EJS (Embedded JavaScript templates)
*   **Database**: MySQL (Relational Database)
*   **Authentication**: Passport.js (Local Strategy & Google OAuth 2.0)
*   **Testing**:
    *   **Unit Test**: Jest
    *   **E2E Test**: Playwright

---

## 🚀 การติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. การเตรียมตัว (Prerequisites)
*   ติดตั้ง [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน 18 ขึ้นไป)
*   ติดตั้ง [MySQL Server](https://www.mysql.com/)

### 2. ติดตั้ง Dependencies
```bash
npm install
npx playwright install
```

### 3. การตั้งค่า Environment Variables
สร้างไฟล์ `.env` ไว้ที่ Root ของโปรเจกต์ (หรือแก้ไขจากไฟล์ที่มีอยู่) โดยระบุข้อมูลดังนี้:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=babadminton

# Session
SESSION_SECRET=your_secret_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
PORT=3000
```

### 4. เตรียมฐานข้อมูล
นำไฟล์ SQL ไปรันใน MySQL ของคุณ:
```bash
mysql -u root -p < model/schema.sql
```

### 5. เริ่มรันโปรเจกต์
```bash
npm start
```
ระบบจะเปิดใช้งานที่: [http://localhost:3000](http://localhost:3000)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

| โฟลเดอร์/ไฟล์ | คำอธิบาย |
| :--- | :--- |
| `app.js` | ไฟล์หลักสำหรับรัน Server และตั้งค่าโปรเจกต์ |
| `controller/` | จัดการ Logic ของระบบ (Auth, Booking, Rooms) |
| `model/` | จัดการการเชื่อมต่อฐานข้อมูลและการคิวรีข้อมูล |
| `view/` | ไฟล์ EJS สำหรับหน้าจอการใช้งาน (UI) |
| `public/` | ไฟล์ Static เช่น CSS, Images, และ Client-side JS |
| `tests/` | ไฟล์สำหรับการทดสอบ (Unit & E2E) |

---

## 🧪 การทดสอบ (Testing)
```bash
# รัน Unit Test ด้วย Jest
npm test

# รัน E2E Test ด้วย Playwright (UI Mode)
npm run test:e2e:ui
```

---

## 🔧 การแก้ไขปัญหาเบื้องต้น (Troubleshooting)

> [!IMPORTANT]
> **Error: listen EADDRINUSE: address already in use :::3000**
> หากคุณพบข้อผิดพลาดนี้ แสดงว่า Port 3000 ถูกใช้งานอยู่ ให้รันคำสั่งด้านล่างเพื่อปิด Process ที่ค้างอยู่ (สำหรับ macOS/Linux):
> ```bash
> kill -9 $(lsof -t -i:3000)
> ```
> หรือเปลี่ยนค่า `PORT` ในไฟล์ `.env` เป็นเลขอื่น เช่น 3001

---

## 🔗 ลิงก์อ้างอิงและผลงาน
*   🎨 **Figma Design**: [คลิกที่นี่เพื่อดู Design](https://www.figma.com/design/S3js0kbbObbP5JP9O8ck8h/)
*   🎬 **Retrospective Videos**:
    *   [Phase 1](https://youtu.be/rXqtMDq-kn4)
    *   [Phase 2](https://youtu.be/J6PpC-khWRU)
    *   [Phase 3](https://youtu.be/gvD6zZ5zfNw)

---
© 2024 BaBadminton Court Booking System
