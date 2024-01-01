import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import models from '../models/index';
import { addPrefixUrl } from '../utils/handleImageUrl';
import { uploadVideoToGCS } from '../services/gcpVideoUpload';
import { spawn } from 'child_process';
import videoTask from '../models/videoTask';

async function getVideos(_req: Request, res: Response) {
  try {
    const now = new Date();

    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const videos = await models.padelVideos.find({
      createdAt: { $gte: fourteenDaysAgo }
    });

    res.send({ data: videos });
  } catch (error) {
    handleHttpError(res, 'CANNOT_GET_VIDEOS', 403);
  }
}

async function getAdminVideos(_req: Request, res: Response) {
  try {
    const videos = await models.padelVideos.find({});

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
  } catch (error) {
    handleHttpError(res, 'CANNOT RELATE MODELS');
  }
}

function timeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

async function cutVideo(req: Request, res: Response): Promise<void> {
  const { startTime, endTime, videoId } = req.body;
  const taskId = `task_${Date.now()}`; // Generamos un identificador único para la tarea.

  const newTask = new videoTask({ taskId, status: 'pending' });
  await newTask.save();

  res
    .status(202)
    .json({ message: 'El proceso de corte de video ha comenzado.', taskId });

  processVideoCut(startTime, endTime, videoId, taskId);
}

async function processVideoCut(
  startTime: string,
  endTime: string,
  videoId: string,
  taskId: string
): Promise<void> {
  try {
    const video = await models.padelVideos.findById(videoId);
    if (!video) {
      await videoTask.updateOne({ taskId }, { status: 'error' });
      return;
    }

    const temp = '/tmp';
    if (!fs.existsSync(temp)) {
      fs.mkdirSync(temp);
    }

    const outputFilename = `cut_${Date.now()}.mp4`;
    const outputPath = path.join(temp, outputFilename);

    const ffmpegPath = 'ffmpeg';
    const startTimeInSeconds = timeToSeconds(startTime);
    const duration = timeToSeconds(endTime) - startTimeInSeconds;

    const args = [
      '-ss',
      String(startTimeInSeconds),
      '-i',
      video.url,
      '-t',
      String(duration),
      '-c',
      'copy',
      outputPath
    ];
    const child = spawn(ffmpegPath, args);

    child.on('exit', async (code) => {
      if (code !== 0) {
        await videoTask.updateOne({ taskId }, { status: 'error' });
        return;
      }
      const publicUrl = await uploadVideoToGCS(outputPath);
      fs.unlinkSync(outputPath);
      await videoTask.updateOne(
        { taskId },
        { status: 'completed', url: publicUrl }
      );
    });

    child.on('error', async (error) => {
      await videoTask.updateOne(
        { taskId },
        {
          status: 'error',
          description: JSON.stringify(error)
        }
      );
    });
  } catch (error) {
    await videoTask.updateOne(
      { taskId },
      {
        status: 'error',
        description: JSON.stringify(error)
      }
    );
  }
}

async function checkVideoStatus(req: Request, res: Response): Promise<void> {
  const { taskId } = req.params;

  const task = await videoTask.findOne({ taskId });
  if (!task) {
    return handleHttpError(res, 'TASK_NOT_FOUND', 404);
  }

  switch (task.status) {
    case 'pending':
      res.status(200).json({ message: 'Video aún en proceso.' });
      break;
    case 'completed':
      res.status(200).json({ message: 'Video procesado.', url: task.url });
      break;
    case 'error':
      handleHttpError(res, 'PROCESSING_ERROR', 500);
      break;
  }
}

export {
  getVideos,
  uploadPadelVideo,
  relateUserWithVideo,
  cutVideo,
  checkVideoStatus,
  getAdminVideos
};
