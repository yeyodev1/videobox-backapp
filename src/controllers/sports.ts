import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import { ImagesEnum } from '../enum/imagesEnum';
import { addPrefixUrl } from '../utils/handleImageUrl';
import models from '../models/index';

async function getSports(_req: Request, res: Response) {
  try {
    const sports = await models.sports.findAllData();
    res.send(sports);
  } catch (error) {
    handleHttpError(res, 'Cannot get sports');
  }
}

async function getSport(req: Request, res: Response) {
  try {
    const { id } = matchedData(req);
    const sport = await models.sports.findOneWithLeagues(id);
    res.send(sport);
  } catch (error) {
    handleHttpError(res, 'Cannot get sports');
  }
}

async function uploadSportImage(req: Request, res: Response) {
  try {
    const { file } = req;
    const response = await gcpImageUpload(file!, ImagesEnum.SPORT);
    const result = addPrefixUrl(response, ImagesEnum.SPORT);
    const fileData = {
      url: result,
      filename: result.split('/')[2]
    };
    const data = await models.sportImages.create(fileData);
    res.send({ data });
  } catch (error) {
    console.log(error);
    handleHttpError(res, 'Error uploading file', 403);
  }
}

async function createSport(req: Request, res: Response) {
  const { body } = req;
  try {
    const newsport = await models.sports.create(body);
    res.send(newsport);
  } catch (error) {
    handleHttpError(res, 'Cannot create sport');
  }
}

async function updateSport(req: Request, res: Response) {
  try {
    const { ...body } = matchedData(req);
    const id = req.params.id;
    await models.sports.findByIdAndUpdate(id, body);
    res.send({
      message: 'Sport updated'
    });
  } catch (error) {
    handleHttpError(res, 'Cannot update sport');
  }
}

async function deleteSport(req: Request, res: Response) {
  try {
    await models.sports.findOneAndDelete({ _id: req.params.id });
    res.send({ message: 'Sport deleted successfully' });
  } catch (error) {
    handleHttpError(res, 'Cannot delete sport');
  }
}

export {
  getSports,
  createSport,
  updateSport,
  deleteSport,
  uploadSportImage,
  getSport
};
