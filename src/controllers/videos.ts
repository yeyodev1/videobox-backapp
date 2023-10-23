import { Request, Response } from 'express';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import models from '../models/index';
import { addPrefixUrl } from '../utils/handleImageUrl';

async function getVideos(_req: Request, res: Response) {
  try {
    const now = new Date();

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const videos = await models.padelVideos.find({
      createdAt: { $gte: sevenDaysAgo }
    });

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
      filename: result.split('/')[2],
      fileId: file?.originalname
    };
    const data = await models.padelVideos.create(fileData);
    res.send({ data });
  } catch (error) {
    handleHttpError(res, 'Error uploading file');
  }
}

async function relateUserWithVideo(req: Request, res: Response) {
  try {
    const email = req.params.userId;
    const videoId = req.params.videoId;

    const user = await models.users.findOne({ email: email });

    if (!user) {
      handleHttpError(res, 'Not found by email');
    }

    const video = await models.padelVideos.findById(videoId);

    if (!video) {
      handleHttpError(res, 'Not found by Id');
    }

    user?.videos.push(videoId);

    await user?.save();

    res.send({
      message: 'VIDEO RELEASED SUCCESSFULLY'
    });
  } catch (error: any) {
    handleHttpError(res, 'CANNOT RELATE MODELS');
  }
}

export { getVideos, uploadPadelVideo, relateUserWithVideo };
