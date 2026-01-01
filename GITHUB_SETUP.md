# GitHub Repository Setup Guide

This guide will help you initialize the Git repository and push it to GitHub with CI/CD configured.

## 📋 Prerequisites

- Git installed
- GitHub account
- Repository created on GitHub (or create one now)

## 🚀 Step 1: Initialize Git Repository

From the root directory (`/Users/kassemshehady/Documents/typscripts/2026/`):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: PulseX CMS monorepo with E2E tests"
```

## 🔗 Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `pulsex-cms`)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL

## 📤 Step 3: Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/pulsex-cms.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## ⚙️ Step 4: Configure Branch Protection (Recommended)

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** for `main` branch
4. Configure protection rules:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - Select: `E2E Tests` and `CI - Build & Test`
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

## 🧪 Step 5: Test the CI/CD Pipeline

### Create a test branch and PR:

```bash
# Create a new branch
git checkout -b test/ci-pipeline

# Make a small change (e.g., add a comment to README)
echo "\n<!-- CI/CD test -->" >> product/README.md

# Commit and push
git add product/README.md
git commit -m "test: Verify CI/CD pipeline"
git push origin test/ci-pipeline
```

### Then:
1. Go to GitHub and create a Pull Request from `test/ci-pipeline` to `main`
2. Watch the CI/CD pipeline run
3. Check that both workflows complete:
   - ✅ **CI - Build & Test**: Builds all packages
   - ✅ **E2E Tests**: Runs Playwright tests

## 📊 What the Workflows Do

### CI - Build & Test (`.github/workflows/ci.yml`)
Runs on every PR and push:
- Lints code (when configured)
- Builds all packages (`shared`, `database`, `cache`, `services`)
- Type checks applications
- Validates Prisma schema

### E2E Tests (`.github/workflows/e2e-tests.yml`)
Runs on PRs to main/develop that touch `product/`:
- Spins up PostgreSQL, Redis, Elasticsearch
- Builds all packages
- Runs database migrations and seeds
- Installs Playwright
- Executes E2E tests
- Uploads test reports and screenshots on failure

## 🔍 Viewing Test Results

If E2E tests fail:
1. Go to **Actions** tab on GitHub
2. Click on the failed workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `playwright-report`: HTML report with test details
   - `test-results`: Screenshots and traces

## 🎯 Local Testing Before Push

Always test locally first:

```bash
# Run E2E tests locally
cd product/e2e
pnpm test

# Run in headed mode (see browser)
pnpm test:headed

# Run with UI mode (interactive)
pnpm test:ui

# Generate and view report
pnpm report
```

## 📝 Git Workflow

### Daily Development:
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, commit frequently
git add .
git commit -m "feat: Your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Convention:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `refactor:` Code refactoring
- `chore:` Maintenance tasks
- `style:` Code style changes (formatting)

## 🔧 Troubleshooting

### If CI fails on first run:
1. Check GitHub Actions logs for specific errors
2. Ensure all secrets are set (if needed)
3. Verify Prisma migrations are committed
4. Check that all dependencies are in `package.json`

### If E2E tests fail:
1. Run tests locally first: `cd product/e2e && pnpm test`
2. Check database connection
3. Ensure pulsex-site server is not already running on port 3003
4. Review Playwright report: `pnpm report`

## 🎉 Success Indicators

You'll know everything works when:
- ✅ Initial push succeeds
- ✅ CI workflow passes (green checkmark)
- ✅ E2E tests pass on PR
- ✅ All 38+ tests pass (Story 1: 12 tests, Story 38: 13 tests, Story 39: 14 tests)

## 📚 Next Steps

After setup:
1. Protect the `main` branch
2. Create a `develop` branch for ongoing work
3. Start working on Story 2 (PostType CRUD)
4. Write more E2E tests for new features
5. Configure deployment pipelines (optional)

---

**Happy Coding! 🚀**

