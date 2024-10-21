import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  findSessionById,
  createSession,
  findUserByEmail,
  deleteSession,
  registerUser,
  updateUser,
  findUserByCred,
  loginOrSignupWithGoogle,
} from '../services/auth.js';
import { setupSessionCookies } from '../utils/setupSessionCookies.js';

import { sendEmailRequest } from '../utils/sendMail.js';
import {
  APP_DOMAIN,
  JWT_SECRET,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { env } from '../utils/env.js';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { generateGoogleAuthUrl } from '../utils/googleOauth2.js';

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
  // await deleteSession(sessionId);

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
  const email = req.body.email;

  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env(APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmailRequest({
      to: email,
      from: env(SMTP.SMTP_FROM),
      sudject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

// ---- Reset Password
export const resetPasswordController = async (req, res) => {
  let enteries;
  try {
    enteries = jwt.verify(req.body.token, env(JWT_SECRET));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await findUserByCred({
    email: enteries.email,
    _id: enteries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encriptedPassword = await bcrypt.hash(req.body.password, 10);

  await updateUser(user._id, encriptedPassword);

  if (req.cookies.sessionId) {
    await deleteSession(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

// ---- get Google OAuth Controller
export const getGoogleOAuthController = async (req, res) => {
  const url = generateGoogleAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

// ---- login With Google Controller
export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSessionCookies(res, session);

  res.json({
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
