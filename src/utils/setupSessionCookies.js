import { refreshTokenLifeTime } from '../constants/index.js';

export const setupSessionCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenLifeTime),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenLifeTime),
  });
};
