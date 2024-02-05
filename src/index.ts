import { Application } from 'express';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';

import syncDriveToGcp from './tasks/syncDriveAndGcp';
import dbConnect from './config/mongo';
import routerApi from './routes';
import { deleteCutVideosFromBucket, deleteOldVideos } from './services/gcpVideoUpload';

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

  cron.schedule('*/90 * * * *', async () => {
    // Coloca aquí el código que deseas ejecutar en el cron job
    await syncDriveToGcp(); // Llama a la función correspondiente
    console.log('Sincronización con drive y drive');
  });

  // trigger delete cut videos from bucket at 3 am
  cron.schedule('0 3 * * *', async () => {
    await deleteCutVideosFromBucket();
    console.log('Videos eliminados del bucket');
  });

  // trigger delete unsued videos from bucket at 4 am
  cron.schedule('*/5 * * * *', async () => {
    await deleteOldVideos();
    console.log('Videos eliminados del bucket');
  });
}

main();
