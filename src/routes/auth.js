import { Router } from 'express';

import { registerUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserController } from '../controllers/ayth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  ctrlWrapper(registerUserController),
  validateBody(registerUserSchema),
);
authRouter.post('/login', validateBody(registerUserSchema));

authRouter.post('/logout', validateBody(registerUserSchema));
authRouter.post('/refresh', validateBody(registerUserSchema));

export default authRouter;
