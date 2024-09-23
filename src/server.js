import express from 'express';
// import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import contactRouter from './routes/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = env(ENV_VARS.PORT, 3000);

export const setupServer = () => {
  const app = express();

  app.use(cors());

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World',
    });
  });

  app.use('/contacts', contactRouter);

  app.use('*', notFoundHandler);

  app.use('*', errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
