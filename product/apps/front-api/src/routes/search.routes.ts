import { Router } from 'express';

const router = Router();

// Full-text search
router.get('/', (req, res) => {
  res.json({ message: 'Search - TODO', query: req.query.q });
});

// Get trending content
router.get('/trending', (req, res) => {
  res.json({ message: 'Get trending content - TODO' });
});

export default router;

