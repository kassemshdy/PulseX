import { Router } from 'express';

const router = Router();

// Get page configuration by slug
router.get('/:slug', (req, res) => {
  res.json({ message: 'Get page config - TODO', slug: req.params.slug });
});

export default router;

