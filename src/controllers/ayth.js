import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  findSessionById,
  createSession,
  findUserByEmail,
  deleteSession,
  registerUser,
} from '../services/auth.js';
import { setupSessionCookies } from '../utils/setupSessionCookies.js';

import { sendEmailRequest } from '../utils/sendMail.js';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';

// ---- User register
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

// ---- Log in and create user's session
export const loginUserController = async (req, res) => {
  const user = await findUserByEmail(req.body.email);

  if (!user) throw createHttpError(401, 'Wrong credentials');

  const isEqualPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isEqualPassword) throw createHttpError(401, 'Wrong credentials');

  const session = await createSession(user._id);

  setupSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'successfully logged in a user !',
    data: {
      accessToken: session.accessToken,
    },
  });
};
// ----- Delete user's session
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await deleteSession(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};
// ----- Refresh user's session

export const refreshUserSessionController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const refreshToken = req.cookies.refreshToken;

  const session = await findSessionById(sessionId, refreshToken);

  if (!session) throw createHttpError(401, 'Session not found');

  const now = new Date(Date.now());

  if (session.refreshTokenValidUntil < now) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = await createSession(session.userId);
  setupSessionCookies(res, newSession);
  await deleteSession(sessionId);

  res.json({
    status: 200,
    message: 'successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

// --- Request reset token
export const requestResetEmailController = async (req, res) => {
  const mail = req.body.email;

  const user = await findUserByEmail(mail);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  try {
    await sendEmailRequest({
      to: mail,
      from: env(SMTP.SMTP_FROM),
      html: '<p>HELLO WORLD</p>',
      sudject: 'reset your password',
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Error in sending email');
  }

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};
