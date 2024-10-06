import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/auth.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/index.js';

export const registerUser = async (userData) => {
  const password = await bcrypt.hash(userData.password, 10);

  return await UserCollection.create({
    ...userData,
    password,
  });
};

export const createSession = async (userId) => {
  SessionsCollection.deleteOne({ userId });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const logoutUser = (sessionId) =>
  SessionsCollection.deleteOne({ _id: sessionId });

// ----------------------------------------

// export const refreshSession = async ({ sessionId, refreshToken }) => {
//   const session = await SessionsCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });

//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   const now = new Date();

//   if (session.refreshTokenValidUntil < now) {
//     throw createHttpError(401, 'Session token expired');
//   }
// };

// -------  Additional servises  ----------

export const findUserByEmail = (email) => UserCollection.findOne({ email });

export const findUserById = (userId) => UserCollection.findById(userId);
