import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@cms/shared';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List terms - TODO' }));
router.post('/', authorize(UserRole.EDITOR, UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Create term - TODO' })
);
router.get('/:id', (req, res) => res.json({ message: 'Get term - TODO' }));
router.put('/:id', authorize(UserRole.EDITOR, UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Update term - TODO' })
);
router.delete('/:id', authorize(UserRole.ADMIN), (req, res) =>
  res.json({ message: 'Delete term - TODO' })
);

export default router;

