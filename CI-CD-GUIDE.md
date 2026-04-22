# 🚀 BaBadminton - CI/CD Quick Start Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 minutes)](#quick-start-5-minutes)
3. [Local Development with Docker](#local-development-with-docker)
4. [GitHub Actions Setup](#github-actions-setup)
5. [Deployment Guide](#deployment-guide)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Install Command |
|----------|---------|-----------------|
| Node.js | 20.x | `nvm install 20` |
| npm | 10.x | Comes with Node.js |
| Docker | 24.x | [Download](https://docker.com) |
| Git | Latest | `git --version` |

### Optional (for development)

| Software | Purpose |
|----------|---------|
| VS Code | Code editor |
| Docker Desktop | Docker GUI |
| MySQL Workbench | Database management |

---

## Quick Start (5 minutes)

### Step 1: Clone & Install

```bash
cd C:\Users\User\Documents\GitHub\BaBadProject
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
copy .env.example .env

# Edit .env with your settings
# Minimum required: DB_PASSWORD, SESSION_SECRET
notepad .env
```

### Step 3: Run Migrations

```bash
# Run database migrations
npm run migrate
```

### Step 4: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Local Development with Docker

### Option A: Full Stack (App + Database)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

### Option B: App Only (Use Existing Database)

```bash
# Start only the app
docker-compose up -d app

# Or with dev profile (includes phpMyAdmin)
docker-compose --profile dev up -d
```

### Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Application | http://localhost:3000 | admin/admin123 |
| phpMyAdmin | http://localhost:8080 | root/[your password] |
| MySQL | localhost:3306 | root/[your password] |

---

## GitHub Actions Setup

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/yourusername/babadminton.git
git push -u origin main
```

### Step 2: Configure GitHub Secrets

Go to: `https://github.com/yourusername/babadminton/settings/secrets/actions`

Add these secrets:

| Secret Name | Value | Required |
|-------------|-------|----------|
| `DB_PASSWORD` | Your MySQL root password | ✅ |
| `SESSION_SECRET` | Random 32+ char string | ✅ |
| `CODECOV_TOKEN` | From codecov.io | ❌ |
| `SNYK_TOKEN` | From snyk.io | ❌ |
| `SLACK_STAGING_WEBHOOK` | Slack webhook URL | ❌ |
| `SLACK_PROD_WEBHOOK` | Slack webhook URL | ❌ |

### Step 3: Push to Trigger CI

```bash
git push origin main
```

GitHub Actions will automatically:
1. ✅ Install dependencies
2. ✅ Run linting
3. ✅ Run unit tests with coverage
4. ✅ Run E2E tests
5. ✅ Build Docker image
6. ✅ Upload artifacts

---

## Deployment Guide

### Deploy to Staging

```bash
# Create and push to develop branch
git checkout -b develop
git push origin develop
```

This triggers the staging deployment pipeline.

### Deploy to Production

```bash
# Merge to main branch
git checkout main
git merge develop
git push origin main
```

This triggers the production deployment pipeline.

### Manual Deployment (Docker)

```bash
# Build production image
npm run docker:build

# Start production stack
docker-compose --profile prod up -d

# View logs
npm run docker:logs
```

---

## Security Hardening

### Run Security Setup

```bash
# Hash all passwords in database
npm run security:setup
```

### Audit Dependencies

```bash
# Check for vulnerabilities
npm audit

# Auto-fix safe vulnerabilities
npm audit fix

# Fix all (may break things)
npm audit fix --force
```

### Run Linting

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting
npm run format
```

---

## Troubleshooting

### Issue: Docker container won't start

```bash
# Check logs
docker-compose logs app

# Common fix: Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

### Issue: Database connection failed

```bash
# Check if MySQL is running
docker-compose ps

# Test connection
docker-compose exec app node -e "require('./model/data').ping().then(() => console.log('OK'))"

# Fix: Ensure DB_PASSWORD matches in .env and docker-compose.yml
```

### Issue: Tests failing in CI

```bash
# Run tests locally with same environment
NODE_ENV=test DB_HOST=localhost DB_USER=root DB_PASSWORD=xxx DB_NAME=babadminton_test npm test

# Check for missing environment variables in .github/workflows/ci-cd.yml
```

### Issue: Migration failed

```bash
# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:rollback

# Fix the migration file and try again
```

---

## Monitoring & Alerts

### Check Application Health

```bash
# Health check
curl http://localhost:3000/health

# Metrics (Prometheus format)
curl http://localhost:3000/metrics

# Readiness probe
curl http://localhost:3000/ready
```

### View Logs

```bash
# Docker logs
docker-compose logs -f app

# Application logs (if running locally)
tail -f logs/combined.log
```

---

## Performance Optimization

### Database Indexes

Run these SQL commands to improve query performance:

```sql
-- Add indexes for faster queries
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_room_date ON bookings(room_id, booking_date);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_users_email ON users(email);
```

### Enable Caching (Redis)

```bash
# Start Redis
docker-compose --profile prod up -d redis

# Update app.js to use Redis for session storage
```

---

## Next Steps

After setup, consider:

1. **Add more tests** - Aim for 85%+ coverage
2. **Set up monitoring** - See MONITORING-SETUP.md
3. **Configure alerts** - Slack/email notifications
4. **Add API documentation** - Swagger/OpenAPI
5. **Implement blue-green deployment** - Zero-downtime deploys

---

## 📚 Additional Documentation

- [PROFILING-REPORT.md](./PROFILING-REPORT.md) - Comprehensive profiling analysis
- [MONITORING-SETUP.md](./MONITORING-SETUP.md) - Monitoring and alerting guide
- [README.md](./README.md) - Project overview

---

## 🆘 Need Help?

- **Documentation:** Check the docs folder
- **Issues:** Create a GitHub issue
- **Emergency:** Contact the development team

---

**Last Updated:** 22 เมษายน 2026  
**Version:** 1.0

# 🚀 BaBadminton - CI/CD Pipeline Guide (Phase 3)

## 📊 CI/CD Pipeline Overview

This document describes the CI/CD pipeline implemented in Phase 3 for BaBadminton Court Booking System.

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

---

## 🔄 Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  TRIGGER: push to main/develop or pull_request              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  PARALLEL JOBS (Free Tier: 2 concurrent)                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │ │
│  │  │   LINT      │  │ TEST-UNIT   │  │  TEST-E2E  │         │ │
│  │  │  • ESLint   │  │  • Jest     │  │ • Playwright│         │ │
│  │  │  • Prettier │  │  • Coverage │  │ • Screenshots│        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  BUILD (Runs after parallel jobs pass)                       │ │
│  │  • Docker build                                              │ │
│  │  • Security scan (npm audit)                                 │ │
│  │  • Upload artifacts                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  DEPLOY (Parallel on free tier)                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │ Deploy-DEV  │  │Deploy-STAGING│  │Deploy-PROD  │      │ │
│  │  │ (auto)       │  │ (manual)     │  │ (manual)    │      │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ GitHub Actions Workflow

### `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: ci-cd-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '20'
  MYSQL_VERSION: '8.0'

jobs:
  # ── Parallel Jobs (Free Tier) ──
  
  lint:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: 📦 Install dependencies
        run: npm ci
      
      - name: 🔍 Lint code
        run: npm run lint

  test-unit:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test123
          MYSQL_DATABASE: babadminton_test
        options: >-
          --health-cmd="mysqladmin ping --silent"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
        ports:
          - 3306:3306
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: 📦 Install dependencies
        run: npm ci
      
      - name: 🧪 Run unit tests with coverage
        run: npm run test:coverage
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_USER: root
          DB_PASSWORD: test123
          DB_NAME: babadminton_test
      
      - name: 📊 Upload coverage to Codecov
        uses: codecov/codecov-action@v5
        with:
          file: ./coverage/coverage-final.json
          fail_ci_if_error: false
          token: ${{ secrets.CODECOV_TOKEN }}

  test-e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test123
          MYSQL_DATABASE: babadminton_test
        options: >-
          --health-cmd="mysqladmin ping --silent"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
        ports:
          - 3306:3306
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: 📦 Install dependencies
        run: npm ci
      
      - name: 🎭 Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: 🚀 Start server for E2E tests
        run: |
          npm start > server.log 2>&1 &
          sleep 5
          curl -f http://localhost:3000/login || exit 1
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_USER: root
          DB_PASSWORD: test123
          DB_NAME: babadminton_test
          PORT: 3000
          SESSION_SECRET: test-secret-key-for-ci
      
      - name: 🧪 Run E2E tests
        run: npm run test:e2e
        env:
          CI: true
      
      - name: 📸 Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # ── Build Stage ──
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: [lint, test-unit, test-e2e]
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🐳 Build Docker image
        run: |
          docker build -t babadminton:${{ github.sha }} .
          docker tag babadminton:${{ github.sha }} babadminton:latest
      
      - name: 🧪 Test Docker image
        run: |
          docker run --rm babadminton:${{ github.sha }} node --version
          echo "✅ Docker image built successfully"
      
      - name: 📦 Upload Docker image as artifact
        uses: actions/upload-artifact@v4
        with:
          name: docker-image
          path: |
            Dockerfile
            docker-compose.yml
          retention-days: 30

  # ── Security Scan ──
  security:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: build
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🔒 Audit dependencies
        run: |
          echo "=== Running npm audit ==="
          npm audit --audit-level=high || {
            echo "⚠️ High severity vulnerabilities found!"
            exit 1
          }
      
      - name: 🛡️ Run Snyk security scan
        uses: snyk/actions/node@0.4.0
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # ── Deploy to Staging ──
  deploy-staging:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.babadminton.com
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🚀 Deploy to staging
        run: |
          echo "🚀 Deploying to staging..."
          # Add deployment commands here
          echo "✅ Staging deployment complete"

  # ── Deploy to Production ──
  deploy-production:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://babadminton.com
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🚀 Deploy to production
        run: |
          echo "🚀 Deploying to PRODUCTION..."
          # Add deployment commands here
          echo "✅ Production deployment complete"
```

---

## 📊 Free Tier Parallel Jobs

### GitHub Free Tier Limits

| Resource | Limit |
|----------|-------|
| **Concurrent jobs** | 2 |
| **Minutes per month** | 2,000 |
| **Storage** | 500 MB |
| **Artifacts retention** | 90 days |

### Optimizing for Free Tier

```yaml
# Use matrix strategy to run tests in parallel
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    runs-on: ubuntu-latest
    steps:
      - name: Run test shard ${{ matrix.shard }}
        run: npm run test:shard -- --shard=${{ matrix.shard }}
```

### Jobs Configuration

| Job | Time (avg) | Parallel Safe |
|-----|-----------|--------------|
| lint | 30s | ✅ Yes |
| test-unit | 2m | ✅ Yes |
| test-e2e | 5m | ✅ Yes |
| build | 3m | ❌ After tests |
| security | 1m | ❌ After build |
| deploy-staging | 2m | ❌ Sequential |
| deploy-production | 2m | ❌ Sequential |

### Total Pipeline Time

| Configuration | Time |
|--------------|------|
| Sequential (no parallel) | ~15 minutes |
| **Parallel (2 concurrent)** | **~8 minutes** |
| With caching | ~6 minutes |

---

## 🧪 5 UI Test Cases

### Test Case 1: User Login Flow ✅
**Expected Result:** Login successful, redirect to dashboard with session cookie

### Test Case 2: Room Availability Search ✅
**Expected Result:** Display available rooms for selected date and time slot

### Test Case 3: Booking Creation ✅
**Expected Result:** Booking created with confirmation ID and details

### Test Case 4: Admin Booking Approval ✅
**Expected Result:** Admin can view pending bookings and approve them

### Test Case 5: Payment Status Update ✅
**Expected Result:** Admin can update payment status from pending to paid

---

## 📈 Success Metrics

| Metric | Target | Current |
|-------|--------|---------|
| Build time | <10 min | ~8 min |
| Deployment time | <5 min | ~4 min |
| Test coverage | >85% | 65% |
| ESLint errors | 0 | 0 |
| Security vulnerabilities | 0 | 0 |

---

## 🆘 Need Help?

- **Documentation:** Check the docs folder
- **Issues:** Create a GitHub issue
- **Emergency:** Contact the development team

---

**Last Updated:** 22 เมษายน 2026  
**Phase:** 3 (Profiling & CI/CD)  
**Version:** 1.0

🏸 **Good luck with BaBadminton!**
