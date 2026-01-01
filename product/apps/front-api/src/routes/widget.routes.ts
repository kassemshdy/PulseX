import { Router } from 'express';

const router = Router();

// Get widget definition
router.get('/:slug', (req, res) => {
  res.json({ message: 'Get widget - TODO', slug: req.params.slug });
});

// Execute widget query and get data
router.post('/:slug/execute', (req, res) => {
  res.json({ message: 'Execute widget query - TODO', slug: req.params.slug });
});

export default router;

