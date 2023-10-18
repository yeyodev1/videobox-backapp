import { Request, Response } from 'express';

import DriveVideoManager from '../services/gcpDriveApi';
import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import models from '../models/index';
import { addPrefixUrl } from '../utils/handleImageUrl';

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

async function uploadPadelVideo(req: Request, res: Response) {
  try {
    const { file } = req;
    const response = await gcpImageUpload(file!, 'video');
    const result = addPrefixUrl(response, 'video');
    const fileData = {
      url: result,
      filename: result.split('/')[2]
    };
    const data = await models.padelVideos.create(fileData);
    res.send({ data });
  } catch (error) {
    handleHttpError(res, 'Error uploading file');
  }
}

export { getVideos, uploadPadelVideo };
