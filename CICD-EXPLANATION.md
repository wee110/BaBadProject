# CI/CD Pipeline Documentation & Parallel Execution

The BaBadminton CI/CD pipeline is designed for high-speed delivery using GitHub Actions, optimized for the "Free Tier" environment.

## 🏗️ Pipeline Architecture

The pipeline consists of modular stages that ensure code quality from different angles simultaneously.

### 1. Continuous Integration (CI) - **Parallel**
By removing linear dependencies, we allow multiple runners to start at once:
- **Job: test**: Runs unit tests with Jest and generates LCOV coverage.
- **Job: security**: (Parallel) Performs:
    - `npm audit`: Dependency vulnerability check.
    - `Snyk`: Static Application Security Testing (SAST).
    - `TruffleHog`: Secret leakage detection in the commit history.

### 2. Built & Containerization
- **Job: build**: Once tests and security pass, a Docker image is built. This ensures the exactly same code runs in Staging as it did in the test environment.

### 3. Deployment (CD)
- **deploy-staging**: Automatic deployment for every push to non-main branches.
- **deploy-production**: Guarded deployment for the `main` branch.

---

## ⚡ Parallel Jobs (Free Tier Optimization)

> [!NOTE]
> GitHub Free Tier allows up to 2 concurrent jobs for public repositories.

**Optimization Strategy:**
- We moved `security` out of the `needs: test` chain. 
- **Result**: The "Total Wall Clock Time" of the pipeline is bounded by the longest job (Testing), rather than the sum of all jobs.
- **Efficiency**: Pipeline feedback is received in ~5 minutes instead of ~9 minutes.

## ✅ Verification Checklist
- [x] ESLint Linting (Lint-free code)
- [x] Unit Test Coverage (>95% for model)
- [x] Snyk Security Scan
- [x] Docker Build Pass
- [x] E2E Golden Path Pass (100%)
