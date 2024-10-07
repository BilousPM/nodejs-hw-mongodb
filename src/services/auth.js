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

  return SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifeTime),
  });
};

export const deleteSession = (sessionId) =>
  SessionsCollection.deleteOne({ _id: sessionId });

export const findSessionById = (sessionId, refreshToken) => {
  return SessionsCollection.findOne({ _id: sessionId, refreshToken });
};

export const findUserByEmail = (email) => UserCollection.findOne({ email });

export const findUserById = (userId) => UserCollection.findById(userId);
