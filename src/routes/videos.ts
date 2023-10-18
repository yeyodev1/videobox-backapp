import express from 'express';

import {
  getVideos,
  uploadPadelVideo,
  relateUserWithVideo
} from '../controllers/videos';
import uploadMiddleware from '../middlewares/handleImage';

const router = express.Router();

router.get('/videos', getVideos);

router.post(
  '/upload-video',
  uploadMiddleware.single('video'),
  uploadPadelVideo
);

router.post('/release-video/:userId/:videoId', relateUserWithVideo);

export default router;
