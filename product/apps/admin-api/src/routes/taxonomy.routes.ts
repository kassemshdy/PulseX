import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@cms/shared';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List taxonomies - TODO' }));
router.post('/', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Create taxonomy - TODO' })
);
router.get('/:id', (req, res) => res.json({ message: 'Get taxonomy - TODO' }));
router.put('/:id', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Update taxonomy - TODO' })
);

export default router;

