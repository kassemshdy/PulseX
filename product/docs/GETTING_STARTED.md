# Getting Started Guide

## Quick Start (< 5 minutes)

### 1. Prerequisites

Ensure you have:
- Node.js >= 18.x
- pnpm >= 8.x
- Docker & Docker Compose

### 2. Clone and Install

```bash
git clone <repository-url>
cd product
pnpm install
```

### 3. Start Infrastructure

```bash
docker-compose up -d postgres redis elasticsearch
```

Wait for services to be healthy (check with `docker-compose ps`).

### 4. Setup Database

```bash
# Copy environment variables
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 5. Start Development

```bash
# Option A: Start everything
pnpm dev:all

# Option B: Start admin only
pnpm dev:admin

# Option C: Start frontend only
pnpm dev:front
```

### 6. Access Applications

- **Admin UI**: http://localhost:3000
- **Admin API**: http://localhost:4000
- **Public Frontend**: http://localhost:3001
- **Public API**: http://localhost:4001

**Default Login:**
- Email: `admin@example.com`
- Password: `admin123456`

## Development Workflow

### Creating a New Post Type

1. Log in to Admin UI
2. Navigate to "Content Types"
3. Click "Create New Type"
4. Define:
   - Name: "Product"
   - Slug: "product"
   - Fields:
     ```json
     [
       { "key": "price", "type": "number", "required": true },
       { "key": "sku", "type": "text", "required": true },
       { "key": "in_stock", "type": "boolean", "default": true }
     ]
     ```
   - Supported Media: ["IMAGE"]
5. Save

### Creating Content

1. Navigate to "Posts" → "Create New"
2. Select Post Type (e.g., "Article")
3. Fill in:
   - Title
   - Slug (auto-generated)
   - Content (rich text editor)
   - Custom fields (based on Post Type)
   - Categories/Tags
   - Featured image
4. Save as Draft or Publish

### Building a Page

1. Navigate to "Pages" → "Create New"
2. Use Page Builder:
   - Drag widgets to zones
   - Configure widget data sources:
     - Static data
     - Latest posts from type
     - Trending posts
     - Custom query
   - Customize styling
3. Preview and Publish

### Social Media Publishing

1. Setup Channels:
   - Navigate to "Channels"
   - Add social accounts (Facebook, Twitter, etc.)
   - Authorize access

2. Publish Content:
   - When creating/editing a post
   - Go to "Social Media" tab
   - Select channels
   - Customize message per platform
   - Schedule or publish immediately

3. Track Operations:
   - Navigate to "Operations"
   - View status of social posts
   - Monitor video uploads
   - Retry failed operations

## Architecture Deep Dive

### Write Flow (Admin → PostgreSQL → Elasticsearch)

```
Admin UI → Admin API → PostgreSQL
                ↓
           Indexing Service
                ↓
          Elasticsearch
```

1. User creates/updates content in Admin UI
2. Admin API validates and saves to PostgreSQL
3. Indexing Service listens for changes
4. Content is denormalized and indexed to Elasticsearch
5. Cache is invalidated

### Read Flow (Public → Cache → Elasticsearch)

```
Public UI → Front API → L1 Cache (Memory)
                    ↓ (miss)
               L2 Cache (Redis)
                    ↓ (miss)
             Elasticsearch
```

1. User visits page
2. Front API checks L1 cache (Memory)
3. If miss, checks L2 cache (Redis)
4. If miss, queries Elasticsearch
5. Result is cached in both L1 and L2
6. Response served to user (< 50ms for cached)

### Cache Invalidation

When content is updated:
1. Admin API publishes invalidation event to Redis
2. Front API instances receive event via pub/sub
3. L1 cache (Memory) is cleared for affected keys
4. L2 cache (Redis) is cleared
5. Next request will repopulate cache

## Common Tasks

### Add a New Custom Field

No code changes needed! Just update the Post Type:

```typescript
// Admin UI → Content Types → Edit "Article"
fields: [
  // ... existing fields
  {
    key: "video_url",
    label: "Video URL",
    type: "url",
    required: false,
    validation: {
      pattern: "^https://.*"
    }
  }
]
```

### Create a Widget

1. Navigate to "Widgets" → "Create New"
2. Configure:
   - Name: "Latest Articles"
   - Slug: "latest-articles"
   - Data Source:
     ```json
     {
       "type": "query",
       "postTypeId": "<article-id>",
       "query": {
         "limit": 10,
         "orderBy": [{ "field": "publishedAt", "direction": "desc" }],
         "filters": { "status": "PUBLISHED" }
       }
     }
     ```
   - View Options:
     ```json
     {
       "layout": "grid",
       "columns": 3,
       "showTitle": true,
       "showExcerpt": true,
       "showDate": true,
       "showAuthor": true,
       "showThumbnail": true
     }
     ```
3. Save and use in Page Builder

### Setup Multi-language

1. Navigate to "Settings" → "Languages"
2. Add supported languages (e.g., "en", "ar", "fr")
3. For each translatable field:
   ```typescript
   // Glossary table automatically stores translations
   {
     resourceId: "post-123",
     resourceType: "post",
     field: "title",
     language: "ar",
     value: "عنوان المقال"
   }
   ```
4. Front API automatically returns content in user's language

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Elasticsearch Not Indexing

```bash
# Check ES health
curl http://localhost:9200/_cluster/health

# Re-index all content
pnpm db:seed  # This triggers indexing
```

### Cache Not Working

```bash
# Check Redis
docker-compose ps redis

# Clear cache
docker-compose exec redis redis-cli FLUSHALL

# Restart services
pnpm dev:front
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3002
```

## Next Steps

- Read [Architecture Overview](./ARCHITECTURE.md)
- Review [API Documentation](./API.md)
- Learn [Testing Guide](./TESTING.md)
- Explore [Deployment Guide](./DEPLOYMENT.md)

## Need Help?

- Check [FAQ](./FAQ.md)
- Review [Common Patterns](./PATTERNS.md)
- Open an issue on GitHub

