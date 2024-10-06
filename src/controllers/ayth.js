import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { refreshTokenLifeTime } from '../constants/index.js';
import {
  createSession,
  findUserByEmail,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const { email, name } = req.body;

  const user = await findUserByEmail(email);
  if (user) throw createHttpError(409, 'Email in use');
  await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user !',
    data: { name, email },
  });
};

export const loginUserController = async (req, res) => {
  const user = await findUserByEmail(req.body.email);

  if (!user) throw createHttpError(401, 'Wrong credentials');

  const isEqualPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isEqualPassword) throw createHttpError(401, 'Wrong credentials');

  const session = await createSession(user._id);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenLifeTime),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenLifeTime),
  });

  res.json({
    status: 200,
    message: 'successfully logged in a user !',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {};
// --------------------------------------
// export const refreshUserSessionController = async (req, res) => {
//   console.log(req.cookies.sessionId);
//   console.log(req.cookies.refreshToken);
//   const session = await refreshSession({
//     refreshToken: req.cookies.refreshToken,
//     sessionId: req.cookies.sessionId,
//   });
//   res.status(200).json({
//     status: 200,
//     message: 'Successfully refreshed a session!',
//     data: {
//       accessToken: session,
//     },
//   });
// };
