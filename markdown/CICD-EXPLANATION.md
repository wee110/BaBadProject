# CI/CD Pipeline Documentation & Parallel Execution

> **สถานะ:** Phase 4 (v2.0.0) — Pipeline design documentation  
> **ระบบ:** BaBadminton Court Booking System

---

## 🏗️ Pipeline Architecture

Pipeline ออกแบบมาเพื่อให้ feedback เร็วที่สุด โดยใช้ GitHub Actions Free Tier (2 concurrent jobs)

### CI Stage — Parallel Execution

```
┌──────────────────────────────────────────────────────────────┐
│  TRIGGER: push to main / pull_request                         │
│                              │                                │
│          ┌──────────────────┴──────────────────┐           │
│          ▼                                      ▼           │
│   ┌─────────────┐                        ┌─────────────┐   │
│   │    LINT     │                        │  TEST-UNIT  │   │
│   │  ESLint.js  │                        │    Jest     │   │
│   └─────────────┘                        └─────────────┘   │
│          │                                      │           │
└──────────┼──────────────────────────────────────┼───────────┘
           │            Parallel (2 jobs)          │
           ▼                                      ▼
                    ┌─────────────┐
                    │    BUILD    │  (รอ Lint + Test ผ่าน)
                    │   Docker   │
                    └─────────────┘
                             │
                             ▼
                    ┌─────────────┐
                    │  SECURITY   │  (npm audit)
                    │   Scan      │
                    └─────────────┘
```

### CD Stage

- **deploy-staging** — ทำงานอัตโนมัติเมื่อ push ไป `develop`
- **deploy-production** — ทำงานเมื่อ push ไป `main` (manual trigger)

---

## ⚡ Free Tier Optimization

| Resource | Limit |
|----------|-------|
| Concurrent jobs | 2 |
| Minutes/month | 2,000 |
| Storage | 500 MB |
| Artifacts | 90 days |

**Optimization Strategy:**
- `security` รัน parallel กับ `lint` + `test-unit` (ไม่ต้องรอ)
- **Result:** Pipeline wall-clock time = longest job แทนที่จะเป็นผลรวมทั้งหมด

### Time Comparison

| Configuration | Estimated |
|--------------|-----------|
| Sequential (all in line) | ~15 min |
| **Parallel (2 concurrent)** | **~8 min** |
| With caching (npm) | ~6 min |

---

## ✅ Verification Checklist

- [x] ESLint — `npm run lint`
- [x] Unit Tests — `npm test` (Jest, model coverage)
- [x] npm audit — Dependency vulnerability check
- [x] Docker Build — `npm run docker:build`
- [x] Playwright E2E — `npm run test:e2e` (5 golden UI tests)

---

## 📦 npm Scripts ที่ใช้ใน CI/CD

```json
{
  "lint":          "eslint . --ext .js",
  "test":          "jest --verbose",
  "test:coverage": "jest --coverage ...",
  "test:e2e":      "playwright test",
  "docker:build":  "docker build -t babadminton:latest .",
  "docker:up":     "docker-compose up -d",
  "docker:down":   "docker-compose down"
}
```

---

## 🔧 Local Dev Quick Commands

```bash
# Dev server
npm run dev

# Run all unit tests
npm test

# E2E tests
npm run test:e2e

# Docker
npm run docker:build
docker-compose up -d

# Audit dependencies
npm audit
```

---

**Last Updated:** 22 เมษายน 2026  
**Version:** 2.0.0
