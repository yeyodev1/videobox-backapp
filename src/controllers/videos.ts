import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import models from '../models/index';
import { addPrefixUrl } from '../utils/handleImageUrl';
import {uploadVideoToGCS} from '../services/gcpVideoUpload'

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

async function cutVideo(req: Request, res: Response) {
  console.log("Iniciando el proceso de corte de video.");

  const { startTime, endTime, videoId } = req.body;
  console.log(`Tiempo de inicio: ${startTime}, Tiempo de finalización: ${endTime}, ID del video: ${videoId}`);

  try {
    console.log(`Buscando el video con ID: ${videoId}`);
    const video = await models.padelVideos.findById(videoId);
    if (!video) {
      console.log(`Video con ID: ${videoId} no encontrado.`);
      return handleHttpError(res, 'VIDEO_NOT_FOUND', 404);
    }

    console.log(`Video con ID: ${videoId} encontrado. Procediendo a cortar el video.`);
    const tempDir = path.join(__dirname, 'temp');
    console.log(`Directorio temporal: ${tempDir}`);

    if (!fs.existsSync(tempDir)) {
      console.log(`Directorio temporal no existe. Creando directorio temporal.`);
      fs.mkdirSync(tempDir);
    }

    const outputFilename = `cut_${Date.now()}.mp4`;
    const outputPath = path.join(tempDir, outputFilename);
    console.log(`Nombre del archivo de salida: ${outputFilename}`);

    ffmpeg(video.url)
      .setStartTime(timeToSeconds(startTime))
      .setDuration(timeToSeconds(endTime) - timeToSeconds(startTime))
      .output(outputPath)
      .on('end', async () => {
        const outputPath = path.join(tempDir, outputFilename);
        console.log(`Video cortado exitosamente. Archivo creado en: ${outputPath}`);
        try {
          console.log(`Subiendo el video cortado a Google Cloud Storage.`);
          const publicUrl = await uploadVideoToGCS(outputPath);
          console.log(`Video subido exitosamente. URL pública: ${publicUrl}`);
      
          console.log(`Eliminando el archivo temporal: ${outputPath}`);
          fs.unlinkSync(outputPath);
          console.log(`Archivo temporal eliminado.`);
      
          res.status(200).json({ url: publicUrl });
        } catch (uploadError) {
          console.error('Error during video upload:', uploadError);
          handleHttpError(res, 'UPLOAD_ERROR', 500);
        }
      })
      .on('error', (err) => {
        console.error('Error with ffmpeg:', err.message);
        handleHttpError(res, 'FFMPEG_ERROR', 500);
      })
      .run();

  } catch (error: any) {
    console.error('Error on process of cut of video', error);
    handleHttpError(res, 'SERVER_ERROR', 500);
  }
}



export { getVideos, uploadPadelVideo, relateUserWithVideo, cutVideo };
