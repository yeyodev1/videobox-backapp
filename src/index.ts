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
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://videobox.pe',
    'https://radiant-narwhal-d48ded.netlify.app'
    // TODO: add app sandbox domain
  ];

  const app: Application = express();

  app.use(cors({ origin: whiteList }));

  app.use(express.json());

  const port: number | string = process.env.PORT || 3000; // Fallback port value, change it to your preferred port

  routerApi(app);


  app.get('/', (_req, res) => {
    res.send('Videobox is aliveeee! (╯°□°）╯');
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();
