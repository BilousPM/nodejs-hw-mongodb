import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/auth.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import { VALID_TIME } from '../constants/index.js';

export const registerUser = async (userData) => {
  const user = await UserCollection.findOne({ email: userData.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  return await UserCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const loginUser = async (userData) => {
  const user = await UserCollection.findOne({ email: userData.email });

  if (!user) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(userData.password, user.password);

  if (!isEqual) throw createHttpError(401, 'Invalid password');

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + VALID_TIME.FIFTIN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + VALID_TIME.ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  console.log(sessionId);
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const now = new Date();

  if (session.refreshTokenValidUntil < now) {
    throw createHttpError(401, 'Session token expired');
  }
};
