import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/auth.js';
import bcrypt from 'bcrypt';

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
