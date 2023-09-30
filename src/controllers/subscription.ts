import { Request, Response } from 'express';

import handleHttpError from '../utils/handleErrors';
import models from '../models/index';

async function updateSubscription(req: Request, res: Response) {
  try {
    const userId = req.body.id;
    const planId = req.body.planId!;

    const plan = await models.plans.findById(planId);

    if (!plan) {
      return handleHttpError(res, 'Plan not found');
    }

    // TODO: calculating expiration date taking current date as reference and the number of weeks on plans
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    const daysToAdd = 7 * plan.durationInWeeks;
    expirationDate.setDate(currentDate.getDate() + daysToAdd);

    await models.users.findByIdAndUpdate(userId, {
      $set: {
        subscriptionStatus: true,
        subscriptionExpirationDate: expirationDate.toISOString()
      }
    });

    res.send({ message: 'Subscribe Successfully' });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Cannot suscribe', 404);
  }
}

async function removeSubscription(req: Request, res: Response) {
  try {
    const id = req.body.id;

    await models.users.findByIdAndUpdate(id, {
      $set: {
        subscriptionStatus: false,
        subscriptionExpirationDate: null
      }
    });

    res.send({ message: 'Subscribe Removed Successfully' });
  } catch (error) {
    handleHttpError(res, 'Cannot remove suscription');
  }
}

export { updateSubscription, removeSubscription };
