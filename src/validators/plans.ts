import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';

import validateResults from '../utils/handleValidator';

const planValidatorCreate = [
  check('name')
    .notEmpty()
    .isString()
    .withMessage('Name is required')
    .isLength({ max: 20 })
    .withMessage('Max Length 20 characters'),

  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Max Length 500 characters'),

  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Only number is allowed'),

  check('image')
    .notEmpty()
    .withMessage('Image is required')
    .isURL()
    .withMessage('No image URL'),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const planValidatorUpdate = [
  check('id').exists().notEmpty().isMongoId(),

  check('name')
    .notEmpty()
    .isString()
    .withMessage('Name is required')
    .isLength({ max: 20 })
    .withMessage('Max Length 20 characters'),

  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Max Length 500 characters'),

  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Only number is allowed'),

  check('image')
    .notEmpty()
    .withMessage('Image is required')
    .isURL()
    .withMessage('No image URL'),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const planValidatorDelete = [
  check('id').exists().notEmpty().isMongoId(),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

export { planValidatorCreate, planValidatorUpdate, planValidatorDelete };
