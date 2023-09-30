import express from 'express';

import uploadMiddleware from '../middlewares/handleImage';
import {
  planValidatorCreate,
  planValidatorUpdate,
  planValidatorDelete
} from '../validators/plans';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  uploadPlanImage
} from '../controllers/plans';

const router = express.Router();

router.get('/plans', getPlans);

// TODO: endpoint to upload image to GCP before createPlan on POST METHOD
router.post(
  '/planImage',
  uploadMiddleware.single('planImage'),
  uploadPlanImage
);

router.post('/plans', planValidatorCreate, createPlan);

router.put('/plans/:id', planValidatorUpdate, updatePlan);

router.delete('/plans/:id', planValidatorDelete, deletePlan);

export default router;
