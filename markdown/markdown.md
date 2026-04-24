# 🏸 BaBadminton Court Booking System - Markdown Documentation

**Version:** 2.0.0  
**Last Updated:** 22 เมษายน 2026  
**Phase:** 3 (Profiling & CI/CD)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [5 UI Test Cases](#5-ui-test-cases)
6. [Profiling Report](#profiling-report)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring Setup](#monitoring-setup)
9. [API Endpoints](#api-endpoints)
10. [Database Schema](#database-schema)

---

## 📖 Project Overview

### Project Name
**BaBadminton** - ระบบจองสนามแบดมินตันออนไลน์

### Project Description
ระบบจองสนามแบดมินตันออนไลน์ที่ครบวงจร สะดวก รวดเร็ว และเป็นมืออาชีพ รองรับการจองสนาม ตรวจสอบสถานะการชำระเงิน และการจัดการโดยผู้ดูแลระบบ

### Target Users
- **ลูกค้า**: ผู้ที่ต้องการจองสนามแบดมินตัน
- **ผู้ดูแลระบบ (Admin)**: ผู้ดูแลสนามและอนุมัติการจอง

---

## ✨ Features

### For Customers (Users)
- ✅ ตรวจสอบสนามว่างแบบ Real-time
- ✅ ระบบจองที่ง่ายดาย
- ✅ ระบบชำระเงิน
- ✅ จัดการการจอง (ดู/ยกเลิก)
- ✅ Google OAuth Login

### For Admins
- ✅ Dashboard สรุปข้อมูล
- ✅ จัดการสถานะการชำระเงิน
- ✅ จัดการสนาม
- ✅ อนุมัติ/ยกเลิกการจอง

### Security Features (Phase 3)
- ✅ Password Hashing (BCrypt)
- ✅ Secure Sessions (HttpOnly + Secure)
- ✅ Rate Limiting
- ✅ Health Check Endpoints

---

## 🛠️ Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime |
| Express.js | 4.18 | Web Framework |
| EJS | 3.1.9 | Template Engine |
| MySQL | 8.0 | Database |
| Passport.js | 0.7.0 | Authentication |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| GitHub Actions | CI/CD Pipeline |
| PM2 | Process Manager |
| Jest | Unit Testing |
| Playwright | E2E Testing |

### Security
| Technology | Purpose |
|------------|---------|
| BCrypt | Password Hashing |
| Helmet | Security Headers |
| Express Rate Limit | API Rate Limiting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x
- MySQL 8.0
- Docker (optional)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/wee110/BaBadProject.git
cd BaBadProject

# 2. Install dependencies
npm install

# 3. Configure environment
copy .env.example .env
# Edit .env with your settings

# 4. Run migrations
npm run migrate

# 5. Start server
npm start
```

### Default Login Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `user1` | `1234` |

---

## 🧪 5 UI Test Cases

### Test Case 1: User Login Flow ✅
**Test ID:** TC-001  
**Feature:** User Authentication  
**Expected Result:** Login successful, redirect to dashboard with session cookie

**Steps:**
1. Navigate to `/login`
2. Enter username: `user1`
3. Enter password: `1234`
4. Click login button
5. **Verify:** Redirect to `/dashboard`
6. **Verify:** Session cookie created

**Status:** ✅ PASS

---

### Test Case 2: Room Availability Search ✅
**Test ID:** TC-002  
**Feature:** Search Functionality  
**Expected Result:** Display available rooms for selected date and time

**Steps:**
1. Navigate to `/search`
2. Select date: Tomorrow
3. Select time slot: 10:00 - 12:00
4. Click search button
5. **Verify:** List of available rooms displayed
6. **Verify:** Room details shown
7. **Verify:** "Book Now" button visible

**Status:** ✅ PASS

---

### Test Case 3: Booking Creation ✅
**Test ID:** TC-003  
**Feature:** Booking System  
**Expected Result:** Booking created with confirmation ID

**Steps:**
1. Login as user1
2. Navigate to `/search`
3. Select available room
4. Enter booking details:
   - Date: Tomorrow
   - Time: 14:00 - 16:00
   - Players: 4
   - Phone: 081-234-5678
5. Click "Confirm Booking"
6. **Verify:** Booking ID generated
7. **Verify:** Confirmation page displayed
8. **Verify:** Booking in dashboard

**Status:** ✅ PASS

---

### Test Case 4: Admin Booking Approval ✅
**Test ID:** TC-004  
**Feature:** Admin Dashboard  
**Expected Result:** Admin can approve pending bookings

**Steps:**
1. Login as admin (`admin` / `admin123`)
2. Navigate to `/admin/dashboard`
3. View pending bookings section
4. Select a pending booking
5. Click "Approve" button
6. **Verify:** Status changes to "approved"
7. **Verify:** Booking removed from pending list

**Status:** ✅ PASS

---

### Test Case 5: Payment Status Update ✅
**Test ID:** TC-005  
**Feature:** Payment Processing  
**Expected Result:** Admin can update payment status to paid

**Steps:**
1. Login as admin
2. Navigate to `/admin/dashboard`
3. Select an approved booking
4. Click "Update Payment" dropdown
5. Select "Paid" option
6. **Verify:** Status changes to "paid"
7. **Verify:** Payment date recorded

**Status:** ✅ PASS

---

## 📊 Profiling Report

### Phase 3 Summary

| Metric | Phase 1 | Phase 2 | Phase 3 (Current) | Target |
|--------|---------|---------|-------------------|--------|
| Lines of Code | 147 | 180 | 210 | 250 |
| Test Coverage | 30% | 50% | **65%** | 85% |
| ESLint Errors | 107 | 45 | **0** | 0 |
| Security Score | 4/10 | 6/10 | **8/10** | 9/10 |
| Avg Response Time | 450ms | 320ms | **180ms** | <200ms |
| P95 Latency | 780ms | 520ms | **380ms** | <400ms |
| Error Rate | 5% | 2% | **0.5%** | <0.5% |

### Static Profiling Results

| Category | Score | Status |
|----------|-------|--------|
| Code Structure | 8/10 | ✅ Good |
| Code Complexity | 7/10 | ✅ Good |
| Dependency Management | 6/10 | ⚠️ Moderate |
| Security | 6/10 | ⚠️ Needs Improvement |
| Documentation | 8/10 | ✅ Good |

### Dynamic Profiling Results

| Metric | Score | Status |
|--------|-------|--------|
| Response Time | 7/10 | ⚠️ Some endpoints slow |
| Database Performance | 6/10 | ⚠️ Missing indexes |
| Memory Management | 9/10 | ✅ No leaks |
| Concurrency | 7/10 | ⚠️ No rate limiting |

---

## 🚀 CI/CD Pipeline

### Pipeline Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Parallel Jobs** | ✅ | Free tier supports 2 concurrent jobs |
| **Auto-trigger** | ✅ | On push to main/develop |
| **Security Scan** | ✅ | npm audit, Snyk, TruffleHog |
| **Docker Build** | ✅ | Multi-stage build |
| **Coverage Report** | ✅ | Codecov integration |
| **Deploy Staging** | ✅ | Auto on develop branch |
| **Deploy Production** | ✅ | Manual trigger on main |

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                           │
├─────────────────────────────────────────────────────────────────┤
│  TRIGGER: push to main/develop or pull_request                   │
│                            │                                      │
│                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  PARALLEL JOBS (Free Tier: 2 concurrent)                    │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │ │
│  │  │   LINT      │  │ TEST-UNIT   │  │  TEST-E2E  │         │ │
│  │  │  • ESLint   │  │  • Jest     │  │ • Playwright│         │ │
│  │  │  • Prettier │  │  • Coverage │  │ • Screenshots│        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            │                                      │
│                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  BUILD + SECURITY SCAN                                       │ │
│  │  • Docker build                                              │ │
│  │  • npm audit                                                 │ │
│  │  • Snyk security scan                                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            │                                      │
│                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  DEPLOY                                                      │ │
│  │  • Deploy-DEV (auto)                                         │ │
│  │  • Deploy-STAGING (manual)                                   │ │
│  │  • Deploy-PRODUCTION (manual)                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Free Tier Limits

| Resource | Limit |
|----------|-------|
| **Concurrent jobs** | 2 |
| **Minutes per month** | 2,000 |
| **Storage** | 500 MB |
| **Artifacts retention** | 90 days |

### Total Pipeline Time

| Configuration | Time |
|--------------|------|
| Sequential | ~15 minutes |
| **Parallel (2 concurrent)** | **~8 minutes** |
| With caching | ~6 minutes |

---

## 📊 Monitoring Setup

### Health Check Endpoints

| Endpoint | Purpose | Check Frequency |
|----------|---------|------------------|
| `GET /health` | Overall health | Every 30s |
| `GET /ready` | Readiness probe | Every 10s |
| `GET /live` | Liveness probe | Every 5s |
| `GET /metrics` | Prometheus metrics | Every 15s |

### Example Health Response

```json
{
  "status": "ok",
  "uptime": 86400.5,
  "checks": {
    "database": { "status": "ok", "responseTime": 5 },
    "memory": { "used": 125, "total": 256, "status": "ok" }
  }
}
```

### Monitoring Tools

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| UptimeRobot | Uptime monitoring | ✅ 50 monitors |
| Sentry | Error tracking | ✅ 5k errors/mo |
| Prometheus | Metrics | ✅ Self-hosted |
| Grafana | Dashboards | ✅ Self-hosted |

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/login` | Login page |
| POST | `/login` | Authenticate user |
| GET | `/logout` | Logout user |
| GET | `/auth/google` | Google OAuth login |
| GET | `/auth/google/callback` | Google OAuth callback |

### User Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | User dashboard |
| GET | `/search` | Search available rooms |
| POST | `/book/:roomId` | Create booking |
| GET | `/my-bookings` | View user's bookings |
| POST | `/cancel-booking/:id` | Cancel booking |

### Admin Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Admin dashboard |
| GET | `/admin/bookings` | View all bookings |
| POST | `/admin/approve/:id` | Approve booking |
| POST | `/admin/reject/:id` | Reject booking |
| POST | `/admin/update-payment/:id` | Update payment status |
| GET | `/admin/rooms` | Manage rooms |
| POST | `/admin/rooms/add` | Add new room |
| POST | `/admin/rooms/:id/edit` | Edit room |
| POST | `/admin/rooms/:id/delete` | Delete room |

### Health Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Overall health |
| GET | `/ready` | Readiness probe |
| GET | `/live` | Liveness probe |
| GET | `/metrics` | Prometheus metrics |

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Rooms Table
```sql
CREATE TABLE rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  room_name VARCHAR(100) NOT NULL,
  room_type VARCHAR(50),
  capacity INT,
  price_per_hour DECIMAL(10,2),
  status ENUM('available', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  players INT,
  phone VARCHAR(20),
  status ENUM('pending', 'approved', 'rejected', 'paid', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);
```

---

## 📈 Performance Metrics

### Current Performance

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Avg Response Time | 180ms | <200ms | ✅ |
| P95 Latency | 380ms | <400ms | ✅ |
| Error Rate | 0.5% | <0.5% | ✅ |
| Memory Usage | 95MB | <100MB | ✅ |
| Uptime | 99.5% | >99.9% | ⚠️ |

### Database Performance

| Query | Before | After | Improvement |
|-------|--------|-------|-------------|
| Search rooms | 45ms | 10ms | 78% |
| Get bookings | 120ms | 35ms | 71% |
| Create booking | 200ms | 80ms | 60% |

---

## 🔒 Security Checklist

- [x] Password hashing with BCrypt
- [x] Secure session cookies (HttpOnly, Secure, SameSite)
- [x] Rate limiting (100 requests/15 min)
- [x] Security headers (Helmet)
- [x] Input validation
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (EJS auto-escape)
- [ ] CSRF protection
- [ ] HTTPS enforcement

---

## 📚 Additional Resources

- [README.md](./README.md) - Project overview
- [PROFILING-REPORT.md](./PROFILING-REPORT.md) - Full profiling analysis
- [CI-CD-GUIDE.md](./CI-CD-GUIDE.md) - CI/CD setup guide
- [MONITORING-SETUP.md](./MONITORING-SETUP.md) - Monitoring guide
- [IMPLEMENTATION-CHECKLIST.md](./IMPLEMENTATION-CHECKLIST.md) - Implementation checklist

---

## 🎓 Lessons Learned

### What Went Well
1. ✅ Clear MVC architecture
2. ✅ Comprehensive test coverage (E2E + Unit)
3. ✅ Parallel CI/CD jobs for faster builds
4. ✅ Security hardening implemented

### Areas for Improvement
1. ⚠️ Still need CSRF protection
2. ⚠️ Database indexes needed for production
3. ⚠️ Redis caching not yet implemented

### Best Practices Applied
1. ✅ Infrastructure as Code
2. ✅ Security-first approach
3. ✅ Automated testing
4. ✅ Comprehensive documentation
5. ✅ Parallel job execution

---

## 🆘 Support

### Documentation
- [GitHub Issues](https://github.com/wee110/BaBadProject/issues)
- [Figma Design](https://www.figma.com/design/S3js0kbbObbP5JP9O8ck8h/)

### Video References
- [Requirement Video](https://youtu.be/maLsAKS-xKs)
- [Phase 1 Retrospective](https://youtu.be/rXqtMDq-kn4)
- [Phase 2 Retrospective](https://youtu.be/J6PpC-khWRU)
- [Phase 3 Retrospective](https://youtu.be/gvD6zZ5zfNw)

---

**Last Updated:** 22 เมษายน 2026  
**Phase:** 3 (Profiling & CI/CD)  
**Version:** 2.0.0

🏸 **Good luck with BaBadminton!**
