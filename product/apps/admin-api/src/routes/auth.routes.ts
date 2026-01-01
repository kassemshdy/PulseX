import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { LoginDtoSchema, RegisterDtoSchema } from '@cms/shared';

const router = Router();
const authController = new AuthController();

router.post('/login', validate(LoginDtoSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/register', validate(RegisterDtoSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.get('/me', authenticate, (req, res, next) =>
  authController.me(req, res, next)
);

router.post('/logout', authenticate, (req, res, next) =>
  authController.logout(req, res, next)
);

router.post('/refresh', (req, res, next) =>
  authController.refresh(req, res, next)
);

export default router;

