import express from 'express';

import {
  getVideos,
  getAdminVideos,
  uploadPadelVideo,
  relateUserWithVideo,
  cutVideo,
  checkVideoStatus
} from '../controllers/videos';
import uploadMiddleware from '../middlewares/handleImage';

const router = express.Router();

router.get('/videos', getVideos);

router.get('/admin-videos', getAdminVideos);

router.post(
  '/upload-video',
  uploadMiddleware.single('video'),
  uploadPadelVideo
);

router.post('/cut-video', cutVideo);

router.post('/release-video/:userId/:videoId', relateUserWithVideo);

router.get('/cut-video/:taskId', checkVideoStatus);

export default router;
