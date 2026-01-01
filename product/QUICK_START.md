# 🚀 Quick Start Guide

## Overview

You now have a complete enterprise CMS foundation with:

✅ **Packages (4)**
- `@cms/shared` - Shared types, DTOs, utilities
- `@cms/database` - Prisma schema with full EAV pattern
- `@cms/cache` - Multi-tier caching (Memory + Redis)
- `@cms/services` - Business logic services

✅ **APIs (2)**
- `@cms/admin-api` - Backend for content management (Port 4000)
- `@cms/front-api` - Backend for public website (Port 4001)

✅ **Infrastructure**
- Docker Compose for PostgreSQL, Redis, Elasticsearch
- Complete Prisma schema with 20+ tables
- Seeding script with sample data
- Makefile for common tasks

## 🏃 Quick Setup (5 Steps)

### 1. Install Dependencies

```bash
cd product
pnpm install
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL, Redis, and Elasticsearch
docker-compose up -d postgres redis elasticsearch

# Wait for services to be ready (~30 seconds)
docker-compose ps
```

### 3. Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 4. Start Backend APIs

```bash
# Terminal 1: Start Admin API
cd apps/admin-api
pnpm dev

# Terminal 2: Start Front API
cd apps/front-api
pnpm dev
```

### 5. Test APIs

```bash
# Health checks
curl http://localhost:4000/health
curl http://localhost:4001/health

# Login (get JWT token)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Subscription-Code: master" \
  -d '{"email":"admin@example.com","password":"admin123456"}'
```

## 📁 Project Structure

```
product/
├── packages/
│   ├── shared/           ✅ Types, DTOs, utilities
│   ├── database/         ✅ Prisma schema (20+ tables)
│   ├── cache/            ✅ Memory + Redis caching
│   └── services/         ✅ Business logic (12+ services)
│
├── apps/
│   ├── admin-api/        ✅ Express API (content management)
│   ├── front-api/        ✅ Express API (public website)
│   ├── admin/            ⏳ Next.js UI (to be implemented)
│   └── front/            ⏳ Next.js UI (to be implemented)
│
├── docker-compose.yml    ✅ Infrastructure setup
├── README.md             ✅ Complete documentation
├── Makefile              ✅ Helper commands
└── GETTING_STARTED.md    ✅ Detailed guide
```

## 🎯 What's Included

### Database Schema (PostgreSQL)

**Content Management (EAV Pattern)**
- `PostType` - Define content structures dynamically
- `Post` - Content instances  
- `PostMeta` - Custom field values (key-value)
- `PostRelation` - Dynamic relations between posts
- `PostTypeRelation` - Define available relations

**Media & Assets**
- `Media` - Media library (images, videos, documents)
- `PostMedia` - Link media to posts (featured, gallery, etc.)

**Taxonomy & Organization**
- `Taxonomy` - Categories, tags, custom taxonomies
- `Term` - Taxonomy terms (hierarchical support)
- `PostTerm` - Assign terms to posts
- `PostTypeTaxonomy` - Link taxonomies to post types

**Pages & Design**
- `Page` - Custom pages with layouts
- `Theme` - Multiple theme support
- `ThemeTemplate` - Page templates with widget zones
- `Widget` - Reusable components

**Social Media & Automation**
- `Channel` - Social media accounts (Facebook, Twitter, YouTube, etc.)
- `PublishedPost` - Track published content
- `AutomationRule` - Trigger-based workflows
- `NotificationTopic` - Push notifications

**Operations & Background Jobs**
- `Operation` - Track async tasks (video uploads, social posts, etc.)
- Real-time progress tracking
- Retry logic with exponential backoff

**Multi-tenancy & Settings**
- `Subscription` - Multi-tenant isolation
- `User` - User management with roles
- `Setting` - Per-subscription configuration
- `Glossary` - Multi-language support

**Analytics & Routing**
- `PageView` - Track content views
- `Link` - Dynamic URL routing

### Services Layer

**Authentication**
- `AuthService` - User authentication & registration
- `TokenService` - JWT token management

**Elasticsearch**
- `ElasticsearchService` - ES client wrapper
- `SearchService` - Full-text search with caching
- `IndexingService` - Sync PostgreSQL → Elasticsearch

**Content**
- `PostService` - CRUD operations for posts
- `PostTypeService` - Manage content types
- `MediaService` - Media library management
- `PageService` - Page management

**Taxonomy**
- `TaxonomyService` - Taxonomy CRUD
- `TermService` - Term management

**Social & Automation**
- `ChannelService` - Social account management
- `OperationService` - Async task tracking
- `QueueService` - BullMQ job queue

**Utilities**
- `SubscriptionService` - Multi-tenancy resolution
- `WidgetService` - Widget management

### Caching Strategy

**L1 Cache (Memory)**
- LRU-based in-memory cache
- 1000 items default
- 5-minute TTL
- Per-process cache

**L2 Cache (Redis)**
- Distributed cache
- Pub/sub for invalidation
- Shared across instances
- Configurable TTL per key

**Cache Managers**
- `WidgetCacheManager` - Widget-specific caching
- Automatic invalidation on content updates
- Cache warming support

## 🛠️ Available Commands

```bash
# Development
make dev              # Start all services
make dev-admin        # Start admin only
make dev-front        # Start frontend only

# Docker
make docker-up        # Start infrastructure
make docker-down      # Stop infrastructure
make docker-logs      # View logs

# Database
make db-setup         # Generate + Migrate + Seed
make db-reset         # Reset and reseed
make db-studio        # Open Prisma Studio

# Testing
make test             # Run unit tests
make test-e2e         # Run E2E tests

# Utilities
make clean            # Clean build artifacts
make lint             # Lint code
make format           # Format code
```

## 🔐 Default Credentials

After seeding, you can login with:
- **Email**: `admin@example.com`
- **Password**: `admin123456`
- **Subscription Code**: `master`

## 📊 Sample Data Included

The seed script creates:
- ✅ Master subscription
- ✅ Admin user
- ✅ Article post type (with custom fields)
- ✅ Author post type (for dynamic relations)
- ✅ Category & Tag taxonomies
- ✅ Sample categories and tags
- ✅ Default theme
- ✅ Homepage template
- ✅ Homepage with layout
- ✅ URL routing
- ✅ System settings

## 🎓 Next Steps

### 1. Implement Route Controllers

All routes are stubbed. Implement controllers:

```typescript
// apps/admin-api/src/controllers/post.controller.ts
import { PostService } from '@cms/services';

export class PostController {
  private postService = new PostService();

  async list(req, res, next) {
    try {
      const { items, total } = await this.postService.findAll(
        req.subscription.id,
        req.query
      );
      res.json(successResponse({ items, total }));
    } catch (error) {
      next(error);
    }
  }
}
```

### 2. Build Frontend UIs

Create Next.js applications:

```bash
# Admin UI
cd apps/admin
npx create-next-app@latest . --typescript --tailwind --app

# Public Frontend
cd apps/front
npx create-next-app@latest . --typescript --tailwind --app
```

### 3. Setup Testing

```bash
# Install test dependencies
pnpm add -D jest @types/jest ts-jest supertest @types/supertest
pnpm add -D playwright @playwright/test
pnpm add -D testcontainers
```

### 4. Add More Features

- [ ] Implement all CRUD controllers
- [ ] Add file upload handling (multer)
- [ ] Implement resumable uploads (tus protocol)
- [ ] Add social media integrations
- [ ] Build page builder UI
- [ ] Add real-time updates (Socket.io)
- [ ] Implement background workers
- [ ] Add comprehensive tests
- [ ] Setup CI/CD pipeline

## 📚 Documentation

- [`README.md`](./README.md) - Complete project overview
- [`GETTING_STARTED.md`](./docs/GETTING_STARTED.md) - Detailed setup guide
- [`olddocs/`](./olddocs/) - Original database schema reference

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Restart services
docker-compose restart

# View logs
docker-compose logs -f postgres

# Clean volumes
docker-compose down -v
```

### Prisma Issues

```bash
# Reset Prisma
pnpm db:generate
pnpm db:push --force-reset
pnpm db:seed
```

## 💡 Key Concepts

### EAV Pattern

Create flexible content without code changes:

```typescript
// 1. Define structure (PostType)
{
  name: "Product",
  fields: [
    { key: "price", type: "number" },
    { key: "sku", type: "text" }
  ]
}

// 2. Create content (Post + PostMeta)
Post { title: "iPhone 15" }
PostMeta { key: "price", value: "999" }
PostMeta { key: "sku", value: "IP15-001" }
```

### CQRS Pattern

Separate read/write for performance:

```
Write (Admin) → PostgreSQL → Indexing → Elasticsearch ← Read (Public)
                                          ↑
                                      Cache Layer
```

### Multi-tier Caching

```
Request → L1 (Memory) → L2 (Redis) → Elasticsearch → Response
         ↓ hit (5ms)   ↓ hit (20ms)  ↓ hit (100ms)
```

## 🎉 You're Ready!

The foundation is complete. Start building amazing features on top of this solid architecture!

**Need help?** Check the documentation or review the existing service implementations for patterns.

