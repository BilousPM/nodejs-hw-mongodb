import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const userData = req.body;

  const newUser = await registerUser(userData);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
};
