import dotenv from 'dotenv';
dotenv.config();

import { app } from "./app";


const PORT = process.env.PORT || 5000;

const start = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  };

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');

  };

  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
};

start();