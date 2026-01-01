import { Router } from 'express';

const router = Router();

// Get content by slug
router.get('/:slug', (req, res) => {
  res.json({ message: 'Get content by slug - TODO', slug: req.params.slug });
});

// List content by type
router.get('/type/:typeSlug', (req, res) => {
  res.json({ message: 'List content by type - TODO', typeSlug: req.params.typeSlug });
});

export default router;

