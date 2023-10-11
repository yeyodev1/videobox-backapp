import { Request, Response } from 'express';

import DriveVideoManager from '../services/gcpDriveApi';
import handleHttpError from '../utils/handleErrors';

const videoManager = new DriveVideoManager();

async function getVideos(_req: Request, res: Response) {
  try {
    const folderId = 'Test Media Player';

    const videos = await videoManager.getDirectVideoLinksInFolder(folderId);

    res.send({ data: videos });
  } catch (error) {
    handleHttpError(res, 'CANNOT_GET_VIDEOS', 403);
  }
}

export { getVideos };
