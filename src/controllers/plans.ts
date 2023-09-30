import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import { ImagesEnum } from '../enum/imagesEnum';
import { addPrefixUrl } from '../utils/handleImageUrl';
import models from '../models/index';

async function getPlans(_req: Request, res: Response) {
  try {
    const plans = await models.plans.find({});
    res.send(plans);
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Cannot get plans');
  }
}

async function uploadPlanImage(req: Request, res: Response) {
  try {
    const { file } = req;
    const response = await gcpImageUpload(file!, ImagesEnum.PLAN);
    const result = addPrefixUrl(response, ImagesEnum.PLAN);
    const fileData = {
      url: result,
      filename: result.split('/')[2]
    };
    const data = await models.planImages.create(fileData);
    res.send({ data });
  } catch (error) {
    handleHttpError(res, 'Error uploading file');
  }
}

async function createPlan(req: Request, res: Response) {
  const { body } = req;
  try {
    const newPlan = await models.plans.create(body);
    res.send(newPlan);
  } catch (error) {
    handleHttpError(res, 'Cannot create plan');
  }
}

async function updatePlan(req: Request, res: Response) {
  try {
    const { id, ...body } = matchedData(req);
    await models.plans.findByIdAndUpdate(id, body);
    res.send({
      message: 'Plan updated'
    });
  } catch (error) {
    handleHttpError(res, 'Cannot update plan');
  }
}

async function deletePlan(req: Request, res: Response) {
  try {
    const { id } = matchedData(req);
    await models.plans.findOneAndDelete({ _id: id });
    res.send({ message: 'Plan deleted successfully' });
  } catch (error) {
    handleHttpError(res, 'Cannot delete plan');
  }
}

export { getPlans, createPlan, updatePlan, deletePlan, uploadPlanImage };
