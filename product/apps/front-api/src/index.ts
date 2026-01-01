import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ElasticsearchService, SearchService } from '@cms/services';
import { CacheService, WidgetCacheManager } from '@cms/cache';

// Import routes
import contentRoutes from './routes/content.routes';
import widgetRoutes from './routes/widget.routes';
import searchRoutes from './routes/search.routes';
import pageRoutes from './routes/page.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4001;

// Initialize services
const esService = new ElasticsearchService({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  indexPrefix: 'cms_',
});

const cacheService = new CacheService(
  { max: 1000, ttl: 300 }, // L1: 1000 items, 5 minutes
  process.env.REDIS_HOST
    ? {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        keyPrefix: 'cms:front:',
      }
    : undefined
);

const searchService = new SearchService(esService, cacheService);
const widgetCacheManager = new WidgetCacheManager(cacheService);

// Make services available to routes
app.locals.esService = esService;
app.locals.cacheService = cacheService;
app.locals.searchService = searchService;
app.locals.widgetCacheManager = widgetCacheManager;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3001'],
    credentials: false,
  })
);

// Rate limiting (more aggressive for public API)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', async (req, res) => {
  const esHealthy = await esService.ping();
  res.json({
    status: esHealthy ? 'healthy' : 'degraded',
    elasticsearch: esHealthy,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/content', contentRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/pages', pageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`,
    },
  });
});

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An internal error occurred',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Front API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await esService.close();
  await cacheService.disconnect();
  process.exit(0);
});

export default app;

