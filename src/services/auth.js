import { UserCollection } from '../db/models/auth.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/index.js';
import { validateCode } from '../utils/googleOauth2.js';

// ---- register user
export const registerUser = async (userData) => {
  const password = await bcrypt.hash(userData.password, 10);
  return await UserCollection.create({
    ...userData,
    password,
  });
};

//  ---- find User By Cred
export const findUserByCred = (userData) =>
  UserCollection.findOne({
    email: userData.email,
    _id: userData._id,
  });

// ---- find User by email
export const findUserByEmail = (email) => UserCollection.findOne({ email });

// ---- find User by id
export const findUserById = (userId) => UserCollection.findById(userId);

// ---- update user
export const updateUser = (id, password) =>
  UserCollection.findByIdAndUpdate(id, {
    password,
  });

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

// ---- login Or Signup With Google
export const loginOrSignupWithGoogle = async (code) => {
  const { payload } = await validateCode(code);
  let user = await UserCollection.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UserCollection.create({
      name: payload.name,
      email: payload.email,
      password,
      avatarUrl: payload.pictures,
    });
  }
  const newSesion = await createSession(user._id);
  return newSesion;
};
