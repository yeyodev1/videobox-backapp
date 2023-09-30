import express from 'express';

import {
  updateSubscription,
  removeSubscription
} from '../controllers/subscription';
import { authenticateToken } from '../middlewares/HandleBearer';

const router = express.Router();

router.patch('/subscription', authenticateToken, updateSubscription);

router.patch('/remove-subscription', authenticateToken, removeSubscription);

export default router;
