import express from 'express';

import uploadMiddleware from '../middlewares/handleImage';
import {
  getSports,
  createSport,
  updateSport,
  deleteSport,
  uploadSportImage,
  getSport
} from '../controllers/sports';
import {
  sportValidatorCreate,
  sportValidatorDelete,
  sportValidatorUpdate,
  sportValidatorDetail
} from '../validators/sports';

const router = express.Router();

router.get('/sports', getSports);

router.get('/sports/:id', sportValidatorDetail, getSport);

// TODO: endpoint to upload image to GCP before create sports on POST METHOD
router.post(
  '/sportImage',
  uploadMiddleware.single('sportImage'),
  uploadSportImage
);

router.post('/sports', sportValidatorCreate, createSport);

router.put('/sports/:id', sportValidatorUpdate, updateSport);

router.delete('/sports/:id', sportValidatorDelete, deleteSport);

export default router;
