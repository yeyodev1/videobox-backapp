import express from 'express';

import { getVideos, uploadPadelVideo } from '../controllers/videos';
import uploadMiddleware from '../middlewares/handleImage';

const router = express.Router();

router.get('/videos', getVideos);

router.post(
  '/upload-video',
  uploadMiddleware.single('video'),
  uploadPadelVideo
);

export default router;
