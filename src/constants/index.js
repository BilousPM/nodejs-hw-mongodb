export const ENV_VARS = {
  PORT: 'PORT',
};

export const MONGO_DB_VARS = {
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const accessTokenLifeTime = 1000 * 60 * 15; // 15 min
export const refreshTokenLifeTime = 1000 * 60 * 60 * 24 * 30; // 30 days
