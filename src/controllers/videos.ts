import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import models from '../models/index';
import { addPrefixUrl } from '../utils/handleImageUrl';
import {uploadVideoToGCS} from '../services/gcpVideoUpload'
import { spawn } from 'child_process';

async function getVideos(_req: Request, res: Response) {
  try {
    // const now = new Date();

    // const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // const videos = await models.padelVideos.find({
    //   createdAt: { $gte: sevenDaysAgo }
    // });
    const videos = await models.padelVideos.find({});
    console.log(videos)

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

function timeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}


const videoProcessingTasks = new Map<string, { status: string, url?: string }>();

async function cutVideo(req: Request, res: Response): Promise<void> {
  const { startTime, endTime, videoId } = req.body;
  const taskId = `task_${Date.now()}`; // Generamos un identificador único para la tarea.

  // Almacenamos la tarea con estado 'pending'.
  videoProcessingTasks.set(taskId, { status: 'pending' });

  // Respondemos inmediatamente que la tarea ha comenzado y proporcionamos el taskId.
  res.status(202).json({ message: 'El proceso de corte de video ha comenzado.', taskId });

  // Iniciamos el proceso de corte en segundo plano.
  processVideoCut(startTime, endTime, videoId, taskId);
}

async function processVideoCut(startTime: string, endTime: string, videoId: string, taskId: string): Promise<void> {
  try {
    const video = await models.padelVideos.findById(videoId);
    if (!video) {
      videoProcessingTasks.set(taskId, { status: 'error', url: '' });
      return;
    }

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const outputFilename = `cut_${Date.now()}.mp4`;
    const outputPath = path.join(tempDir, outputFilename);

    const ffmpegPath = 'ffmpeg';
    const startTimeInSeconds = timeToSeconds(startTime);
    const duration = timeToSeconds(endTime) - startTimeInSeconds;
    
    const args = ['-ss', String(startTimeInSeconds), '-i', video.url, '-t', String(duration), '-c', 'copy', outputPath];
    const child = spawn(ffmpegPath, args);

    child.on('exit', async (code) => {
      if (code !== 0) {
        videoProcessingTasks.set(taskId, { status: 'error', url: '' });
        return;
      }
      try {
        const publicUrl = await uploadVideoToGCS(outputPath);
        fs.unlinkSync(outputPath); // Eliminamos el archivo local una vez subido a GCS
        videoProcessingTasks.set(taskId, { status: 'completed', url: publicUrl });
      } catch (error) {
        videoProcessingTasks.set(taskId, { status: 'error', url: '' });
      }
    });

    child.on('error', () => {
      videoProcessingTasks.set(taskId, { status: 'error', url: '' });
    });
  } catch (error) {
    videoProcessingTasks.set(taskId, { status: 'error', url: '' });
  }
}

async function checkVideoStatus(req: Request, res: Response): Promise<void> {
  const { taskId } = req.params;

  const task = videoProcessingTasks.get(taskId);
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



export { getVideos, uploadPadelVideo, relateUserWithVideo, cutVideo, checkVideoStatus };
