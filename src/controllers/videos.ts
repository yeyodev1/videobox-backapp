import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import multer from 'multer';
import videoCut from '../models/padelVideosCut';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import models from '../models/index';
import { addPrefixUrl } from '../utils/handleImageUrl';
import Video from '../models/padelVideosCut';
import DriveVideoManager from '../services/gcpDriveApi';
import {uploadVideoToGCS} from '../services/gcpVideoUpload'

const driveManagger = new DriveVideoManager();

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

// async function cutVideo(req: Request, res: Response) {
//   const { startTime, endTime, videoId } = req.body;
//   console.log('Received request to cut video:', videoId, 'from', startTime, 'to', endTime);
//   console.log('Start time:', startTime, 'End time:', endTime);

//   function timeToSeconds(time: string): number {
//     const parts = time.split(':').map(part => parseInt(part, 10));
//     return parts.reduce((acc, part) => 60 * acc + part, 0);
//   }
//   const startTimeInSeconds: number = timeToSeconds(req.body.startTime);
//   const endTimeInSeconds: number = timeToSeconds(req.body.endTime);
//   const durationInSeconds: number = endTimeInSeconds - startTimeInSeconds;

//   console.log(`Start time in seconds: ${startTimeInSeconds}`);
//   console.log(`End time in seconds: ${endTimeInSeconds}`);
//   console.log(`Duration in seconds: ${durationInSeconds}`);

//   let tempDownloadPath: any = null;
//   try {
//     console.log('Attempting to find video by ID');
//     const video = await models.padelVideos.findById(videoId);
//     if (!video) {
//       console.log('Video not found:', videoId);
//       return handleHttpError(res, 'VIDEO_NOT_FOUND', 404);
//     }
//     console.log('Video found:', video.url);
//     const videoUrl = video.url

//     const tempDir = path.join(__dirname, 'temp');
//     if (!fs.existsSync(tempDir)){
//       fs.mkdirSync(tempDir, { recursive: true });
//     }

//     tempDownloadPath = path.join(tempDir, `download_${Date.now()}.mp4`);
//     const writer = fs.createWriteStream(tempDownloadPath);

//     const response = await axios.get(videoUrl, { responseType: 'stream' });
//     response.data.pipe(writer);

//     await new Promise((resolve, reject) => {
//       writer.on('finish', resolve);
//       writer.on('error', reject);
//     });

//     const outputDirectory = path.join(__dirname, 'videosTemporales');
//     if (!fs.existsSync(outputDirectory)) {
//       fs.mkdirSync(outputDirectory, { recursive: true });
//     }

//     const outputFilename = `cut_${Date.now()}.mp4`;
//     const outputPath = path.join(outputDirectory, outputFilename);

//     ffmpeg(tempDownloadPath)
//       .setStartTime(startTimeInSeconds)
//       .duration(durationInSeconds)
//       .output(outputPath)
//       .on('start', (commandLine) => {
//         console.log('Spawned Ffmpeg with command:', commandLine);
//       })
//       .on('end', async () => {
//         console.log('Video has been cut successfully.');
//         if (!res.headersSent) {
//           res.sendFile(outputPath, (err) => {
//             if (err) {
//               console.error('Error during file send:', err);
//               return handleHttpError(res, 'FILE_SEND_ERROR', 500);
//             }
//             fs.unlinkSync(tempDownloadPath);
//             fs.unlinkSync(outputPath);
//           });
//         } else {
//           console.error('Response already sent, cannot send file.');
//           fs.unlinkSync(tempDownloadPath);
//           fs.unlinkSync(outputPath);
//         }
//       })
//       // .on('end', async () => {
//       //   console.log('video has been cut as a champion.');
//       //   const newVideo = new Video ({
//       //     name: 'descarga_cortada_larga',
//       //     url: outputPath,
//       //     size: fs.statSync(outputPath).size,
//       //   })

//       //   try {
//       //     const savedVideo = await newVideo.save();
//       //     console.log('video guardado en mongoDB:', savedVideo)
//       //   } catch (error) {
//       //     console.error('Error guardando el video:', error);
//       //   }
//       //   res.sendFile(outputPath, (error) => {
//       //     if(error) {
//       //       console.error('error during send file', error)
//       //     }
//       //     fs.unlinkSync(tempDownloadPath);
//       //     fs.unlinkSync(outputPath);
//       //   })
//       // })
//       .on('error', (err) => {
//         console.error('Error with ffmpeg:', err.message);
//         handleHttpError(res, 'FFMPEG_ERROR', 500);
//         fs.unlinkSync(tempDownloadPath);
//       })
//       .run()
//   } catch (error) {
//     console.error('Error:', error);
//     handleHttpError(res, 'SERVER_ERROR', 500);

//     if (tempDownloadPath && fs.existsSync(tempDownloadPath)) {
//       fs.unlinkSync(tempDownloadPath);
//     }
//   }
// }

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
