import { Router } from 'express';

import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/ayth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  ctrlWrapper(registerUserController),
  validateBody(registerUserSchema),
);
authRouter.post(
  '/login',
  ctrlWrapper(loginUserController),
  validateBody(loginUserSchema),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default authRouter;
