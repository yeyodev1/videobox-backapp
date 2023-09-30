import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import { ImagesEnum } from '../enum/imagesEnum';
import { addPrefixUrl } from '../utils/handleImageUrl';
import models from '../models/index';

async function getClubs(_req: Request, res: Response) {
  try {
    const clubs = await models.clubs.find({});
    res.send(clubs);
  } catch (error) {
    handleHttpError(res, 'Cannot get clubs');
  }
}

async function uploadClubImage(req: Request, res: Response) {
  try {
    const { file } = req;
    const response = await gcpImageUpload(file!, ImagesEnum.CLUB);
    const result = addPrefixUrl(response, ImagesEnum.CLUB);
    const fileData = {
      url: result,
      filename: result.split('/')[2]
    };
    const data = await models.clubImages.create(fileData);
    res.send({ data });
  } catch (error) {
    handleHttpError(res, 'Error uploading file');
  }
}

async function createClub(req: Request, res: Response) {
  const { body } = req;
  try {
    const newleague = await models.clubs.create(body);
    res.send(newleague);
  } catch (error) {
    handleHttpError(res, 'Cannot create club');
  }
}

async function updateClub(req: Request, res: Response) {
  try {
    const { id, ...body } = matchedData(req);
    await models.clubs.findByIdAndUpdate(id, body);
    res.send({
      message: 'Club updated'
    });
  } catch (error) {
    handleHttpError(res, 'Cannot update club');
  }
}

async function deleteClub(req: Request, res: Response) {
  try {
    await models.clubs.findOneAndDelete({ _id: req.params.id });
    res.send({ message: 'Club deleted successfully' });
  } catch (error) {
    handleHttpError(res, 'Cannot delete club');
  }
}

export {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  uploadClubImage
};
