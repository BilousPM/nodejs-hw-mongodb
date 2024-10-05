import { Router } from 'express';

import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
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

authRouter.post('/logout', validateBody(registerUserSchema));
authRouter.post('/refresh', validateBody(registerUserSchema));

export default authRouter;
