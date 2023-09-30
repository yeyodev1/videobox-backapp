import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Application } from 'express';

import dbConnect from './config/mongo';
import routerApi from './routes';
// import { sendVerification } from './scripts/EmailVerification';

async function main() {
  await dbConnect();

  dotenv.config();

  const whiteList: string[] = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://predix.ec'
    // TODO: add app sandbox domain
  ];

  const app: Application = express();

  app.use(cors({ origin: whiteList }));

  app.use(express.json());

  const port: number | string = process.env.PORT || 3000; // Fallback port value, change it to your preferred port

  routerApi(app);

  // sendVerification();

  app.get('/', (_req, res) => {
    res.send('Predix is online');
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();
