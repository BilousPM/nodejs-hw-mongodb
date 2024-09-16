import dotenv from 'dotenv';
dotenv.config();

export const env = (name, defaulValue) => {
  const value = process.env[name];

  if (value) return value;

  if (defaulValue) return defaulValue;

  throw new Error(`Missing: process.env['${name}']`);
};