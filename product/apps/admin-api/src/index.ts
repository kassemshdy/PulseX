import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/not-found.middleware';
import { subscriptionMiddleware } from './middleware/subscription.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import postTypeRoutes from './routes/post-type.routes';
import mediaRoutes from './routes/media.routes';
import pageRoutes from './routes/page.routes';
import taxonomyRoutes from './routes/taxonomy.routes';
import termRoutes from './routes/term.routes';
import widgetRoutes from './routes/widget.routes';
import channelRoutes from './routes/channel.routes';
import operationRoutes from './routes/operation.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Subscription resolution middleware
app.use('/api', subscriptionMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/post-types', postTypeRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/taxonomies', taxonomyRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/operations', operationRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Admin API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;

