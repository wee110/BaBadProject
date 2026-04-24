# 🚀 BaBadminton - CI/CD Setup Guide

> **Version:** 2.0.0  
> **Prerequisites:** Node.js 20.x, npm 10.x, Docker 24.x, Git

---

## 🚀 Quick Start (5 นาที)

```bash
# 1. Clone & Install
git clone https://github.com/wee110/BaBadProject.git
cd BaBadProject
npm install

# 2. Setup Environment
copy .env.example .env
# แก้ไข .env — ค่าขั้นต่ำที่ต้องมี: DB_PASSWORD, SESSION_SECRET

# 3. Start server
npm run dev
# → http://localhost:3000
```

---

## 🐳 Docker Dev Environment

### Option A: Full Stack (App + Database)

```bash
docker-compose up -d
docker-compose logs -f app    # ดู logs
docker-compose down          # หยุด
```

### Option B: App Only (ใช้ DB ที่มีอยู่แล้ว)

```bash
docker-compose up -d app
```

### Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | admin / admin123 |
| phpMyAdmin | http://localhost:8080 | root / [your password] |

---

## 🐙 GitHub Actions Setup

### 1. Create Repo

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/babadminton.git
git push -u origin main
```

### 2. Add GitHub Secrets

ไปที่: `Settings → Secrets and variables → Actions`

| Secret | Required | Description |
|--------|----------|-------------|
| `DB_PASSWORD` | ✅ | MySQL root password |
| `SESSION_SECRET` | ✅ | Random string 32+ chars |
| `CODECOV_TOKEN` | ❌ | From codecov.io |
| `SNYK_TOKEN` | ❌ | From snyk.io |

### 3. Push to Trigger CI

```bash
git push origin main
```

Pipeline จะทำงานอัตโนมัติ:
1. ✅ Install dependencies
2. ✅ ESLint
3. ✅ Jest unit tests
4. ✅ Playwright E2E tests
5. ✅ Docker build
6. ✅ Security scan (npm audit)

---

## 📦 npm Scripts Reference

```bash
# Development
npm run dev          # Start dev server
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format

# Testing
npm test             # Unit tests (Jest)
npm run test:coverage # Unit tests + coverage report
npm run test:e2e     # Playwright E2E tests
npm run test:e2e:headed # E2E with UI

# Database
npm run migrate          # Run migrations
npm run migrate:status   # Check status
npm run migrate:rollback # Rollback last

# Docker
npm run docker:build     # Build Docker image
npm run docker:up        # docker-compose up -d
npm run docker:down      # docker-compose down
npm run docker:logs      # docker-compose logs -f

# Security
npm run security:setup   # Hash passwords in DB
npm audit                 # Check vulnerabilities
npm audit fix            # Auto-fix (safe only)
```

---

## 🔒 Security Commands

```bash
# Hash all passwords in database
npm run security:setup

# Dependency audit
npm audit
npm audit fix
```

---

## 🚨 Troubleshooting

### Docker container won't start

```bash
# ดู logs
docker-compose logs app

# Fix: Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

### Database connection failed

```bash
# ตรวจสอบว่า MySQL ทำงานอยู่
docker-compose ps

# Fix: ตรวจสอบ DB_PASSWORD ใน .env ว่าตรงกับ docker-compose.yml
```

### Tests fail in CI

```bash
# รัน local ด้วย env เดียวกับ CI
NODE_ENV=test DB_HOST=localhost DB_USER=root DB_PASSWORD=xxx DB_NAME=babadminton_test npm test
```

### Migration failed

```bash
npm run migrate:status
npm run migrate:rollback
# แก้ไข migration file แล้วลองใหม่
```

---

## 🏥 Health Check

```bash
curl http://localhost:3000/health    # Health check
curl http://localhost:3000/ready      # Readiness probe
curl http://localhost:3000/live       # Liveness probe
curl http://localhost:3000/metrics    # Prometheus metrics
```

---

## 📚 Related Docs

- `README.md` — Project overview
- `PROFILING-REPORT.md` — Profiling analysis
- `MONITORING-SETUP.md` — Monitoring setup

---

**Last Updated:** 22 เมษายน 2026  
**Version:** 2.0.0
