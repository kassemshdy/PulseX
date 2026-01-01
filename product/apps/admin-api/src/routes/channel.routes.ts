import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@cms/shared';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List channels - TODO' }));
router.post('/', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Create channel - TODO' })
);
router.get('/:id', (req, res) => res.json({ message: 'Get channel - TODO' }));
router.put('/:id', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Update channel - TODO' })
);
router.delete('/:id', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Delete channel - TODO' })
);

export default router;

