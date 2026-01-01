import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => res.json({ message: 'List media - TODO' }));
router.post('/upload', (req, res) => res.json({ message: 'Upload media - TODO' }));
router.get('/:id', (req, res) => res.json({ message: 'Get media - TODO' }));
router.put('/:id', (req, res) => res.json({ message: 'Update media - TODO' }));
router.delete('/:id', (req, res) => res.json({ message: 'Delete media - TODO' }));

export default router;

