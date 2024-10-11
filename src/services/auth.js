import { UserCollection } from '../db/models/auth.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/index.js';

// ---- register user
export const registerUser = async (userData) => {
  const password = await bcrypt.hash(userData.password, 10);
  return await UserCollection.create({
    ...userData,
    password,
  });
};

// ---- find User by email
export const findUserByEmail = (email) => UserCollection.findOne({ email });

// ---- find User by id
export const findUserById = (userId) => UserCollection.findById(userId);

// ---- create Session
export const createSession = async (userId) => {
  await SessionsCollection.deleteOne({ userId });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

  return SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

// ---- delete session
export const deleteSession = (sessionId) =>
  SessionsCollection.deleteOne({ _id: sessionId });

// ---- find session by id
export const findSessionById = (sessionId, refreshToken) =>
  SessionsCollection.findOne({ _id: sessionId, refreshToken });

// ---- find session by token
export const findSessionByToken = (token) =>
  SessionsCollection.findOne({
    accessToken: token,
  });

// ---- request reset token
