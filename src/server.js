import express from 'express';

export const setupServer = () => {
  const app = express();
  const PORT = 3000;

  

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello_World I am Fine :)',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
