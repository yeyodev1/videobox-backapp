import express from 'express';

import uploadMiddleware from '../middlewares/handleImage';
import {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  uploadClubImage
} from '../controllers/clubs';
import {
  clubValidatorCreate,
  clubValidatorDelete,
  clubValidatorUpdate
} from '../validators/clubs';

const router = express.Router();

router.get('/club', getClubs);

// TODO: endpoint to upload image to GCP before create league on POST METHOD
router.post(
  '/leagueImage',
  uploadMiddleware.single('clubImage'),
  uploadClubImage
);

router.post('/clubs', clubValidatorCreate, createClub);

router.put('/clubs/:id', clubValidatorUpdate, updateClub);

router.delete('/clubs/:id', clubValidatorDelete, deleteClub);

export default router;
