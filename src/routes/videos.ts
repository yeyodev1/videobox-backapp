import express from 'express';

import { getVideos } from '../controllers/videos';

const router = express.Router();

router.get('/videos', getVideos);

export default router;
