import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@cms/shared';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List widgets - TODO' }));
router.post('/', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Create widget - TODO' })
);
router.get('/:id', (req, res) => res.json({ message: 'Get widget - TODO' }));
router.put('/:id', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Update widget - TODO' })
);
router.delete('/:id', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Delete widget - TODO' })
);

export default router;

