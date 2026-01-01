import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@cms/shared';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List posts - TODO' }));
router.post('/', authorize(UserRole.AUTHOR, UserRole.EDITOR, UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Create post - TODO' })
);
router.get('/:id', (req, res) => res.json({ message: 'Get post - TODO' }));
router.put('/:id', authorize(UserRole.AUTHOR, UserRole.EDITOR, UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Update post - TODO' })
);
router.delete('/:id', authorize(UserRole.EDITOR, UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Delete post - TODO' })
);

export default router;

