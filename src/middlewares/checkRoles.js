import createHttpError from 'http-errors';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;

    if (!user) next(createHttpError(401));
  };

// const { role } = user;
