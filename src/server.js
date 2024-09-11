import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

export const setupServer = () => {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('*', (req, res, next) => {
    console.log(`Server startup time: ${new Date().toLocaleString()}`);
    next();
  });

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello_World I am ine :)',
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use('*', (err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
