import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@cms/shared';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List post types - TODO' }));
router.post('/', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Create post type - TODO' })
);
router.get('/:id', (req, res) => res.json({ message: 'Get post type - TODO' }));
router.put('/:id', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Update post type - TODO' })
);

export default router;

