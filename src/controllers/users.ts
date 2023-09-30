import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { ImagesEnum } from '../enum/imagesEnum';
import gcpImageUpload from '../services/gcpImageUpload';
import handleHttpError from '../utils/handleErrors';
import { addPrefixUrl } from '../utils/handleImageUrl';
import models from '../models/index';

async function getUsers(_req: Request, res: Response) {
  try {
    const users = await models.users.find({});
    res.send(users);
  } catch (error) {
    handleHttpError(res, 'Cannot get users');
  }
}

async function uploadUserImage(req: Request, res: Response) {
  try {
    const { file } = req;
    const response = await gcpImageUpload(file!, ImagesEnum.USER);
    const result = addPrefixUrl(response, ImagesEnum.USER);
    const fileData = {
      url: result,
      filename: result.split('/')[2]
    };
    const data = await models.userImages.create(fileData);
    res.send({ data });
  } catch (error) {
    handleHttpError(res, 'Error uploading file');
  }
}

async function updateUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const body = matchedData(req);
    await models.users.findByIdAndUpdate(id, body);
    res.send({
      message: 'User updated'
    });
  } catch (error) {
    handleHttpError(res, 'Cannot update user');
  }
}

async function getUser(req: Request, res: Response) {
  try {
    const id = req.body.id;
    const user = await models.users.findById(id);

    if (!user) {
      handleHttpError(res, 'Usuario no existe');
      return;
    }

    const data = {
      name: user?.name,
      lastname: user?.lastname,
      userImage: user?.userImage,
      id: user?._id,
      role: user?.role,
      email: user.email,
      birthdate: user?.birthdate,
      twitter: user?.twitter,
      instagram: user?.instagram,
      susbcriptionStatus: user?.subscriptionStatus,
      subscriptionExpirationDate: user?.subscriptionExpirationDate,
      emailVerified: user.emailVerified
    };

    res.send({ data });
  } catch (error) {
    handleHttpError(res, 'Cannot login');
  }
}

export { getUsers, updateUser, uploadUserImage, getUser };
