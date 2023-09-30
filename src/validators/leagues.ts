import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';
import validateResults from '../utils/handleValidator';

const leagueValidatorCreate = [
  check('name')
    .notEmpty()
    .isString()
    .withMessage('Name is required')
    .isLength({ max: 20 })
    .withMessage('Max Length 20 characters'),

  check('image')
    .notEmpty()
    .withMessage('Image is required')
    .isURL()
    .withMessage('No image URL'),

  check('sport')
    .exists()
    .isMongoId()
    .withMessage('Sport reference is required'),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const leagueValidatorUpdate = [
  check('id').exists().notEmpty().isMongoId(),

  check('name')
    .notEmpty()
    .isString()
    .withMessage('Name is required')
    .isLength({ max: 20 })
    .withMessage('Max Length 20 characters'),

  check('image')
    .notEmpty()
    .withMessage('Image is required')
    .isURL()
    .withMessage('No image URL'),

  check('sport')
    .exists()
    .isMongoId()
    .withMessage('Sport reference is required'),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const leagueValidatorDelete = [
  check('id').exists().notEmpty().isMongoId(),
  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

export { leagueValidatorCreate, leagueValidatorUpdate, leagueValidatorDelete };
