import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List operations - TODO' }));
router.get('/:id', (req, res) => res.json({ message: 'Get operation - TODO' }));
router.post('/:id/cancel', (req, res) => res.json({ message: 'Cancel operation - TODO' }));
router.post('/:id/retry', (req, res) => res.json({ message: 'Retry operation - TODO' }));

export default router;

