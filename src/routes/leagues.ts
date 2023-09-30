import express from 'express';

import uploadMiddleware from '../middlewares/handleImage';
import {
  getLeagues,
  createLeague,
  updateLeague,
  deleteLeague,
  uploadLeagueImage
} from '../controllers/leagues';
import {
  leagueValidatorCreate,
  leagueValidatorDelete,
  leagueValidatorUpdate
} from '../validators/leagues';

const router = express.Router();

router.get('/leagues', getLeagues);

// TODO: endpoint to upload image to GCP before create league on POST METHOD
router.post(
  '/leagueImage',
  uploadMiddleware.single('leagueImage'),
  uploadLeagueImage
);

router.post('/leagues', leagueValidatorCreate, createLeague);

router.put('/leagues/:id', leagueValidatorUpdate, updateLeague);

router.delete('/leagues/:id', leagueValidatorDelete, deleteLeague);

export default router;
