import { Request, Response } from 'express';
import syncDriveToGcp from '../tasks/syncDriveAndGcp';

export default async (_req: Request, res: Response) => {
  try {
    await syncDriveToGcp();
    console.log('Sincronización con drive y drive');
    res.status(200).send('Sincronización completada.');
  } catch (error) {
    console.error('Error en la sincronización:', error);
    res.status(500).send('Error en la sincronización.');
  }
};
