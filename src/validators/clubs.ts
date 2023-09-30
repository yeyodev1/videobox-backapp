import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';
import validateResults from '../utils/handleValidator';

const clubValidatorCreate = [
  check('name')
    .notEmpty()
    .isString()
    .withMessage('Name is required')
    .isLength({ max: 40 })
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

const clubValidatorUpdate = [
  check('id').exists().notEmpty().isMongoId(),

  check('name')
    .notEmpty()
    .isString()
    .withMessage('Name is required')
    .isLength({ max: 40 })
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

const clubValidatorDelete = [
  check('id').exists().notEmpty().isMongoId(),
  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

export { clubValidatorCreate, clubValidatorUpdate, clubValidatorDelete };
