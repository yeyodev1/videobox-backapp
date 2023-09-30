import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';

import validateResults from '../utils/handleValidator';
import { BetEnum } from '../enum/betEnum';

const betValidatorCreate = [
  check('sport').exists().notEmpty().withMessage('Sport is required.'),

  check('league').exists().notEmpty().withMessage('League is required.'),

  check('teamA').exists().notEmpty().withMessage('First team is required.'),

  check('teamB').exists().notEmpty().withMessage('Second team is required.'),

  check('date')
    .exists()
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Date should has ISO format.'),

  check('profit').exists().notEmpty().isNumeric().isInt(),

  check('percentage').exists().notEmpty().isNumeric().isInt(),

  check('description')
    .exists()
    .notEmpty()
    .withMessage('Description is required'),

  check('isFree')
    .exists()
    .withMessage('isFree is required')
    .notEmpty()
    .withMessage('isFree cant be empty')
    .isBoolean()
    .withMessage('isFree needs to be a boolean'),

  check('status').exists().notEmpty().withMessage('Status is required.'),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const betValidatorUpdate = [
  check('id').exists().notEmpty().isMongoId(),

  check('sport').exists().notEmpty().withMessage('Sport is required.'),

  check('league').exists().notEmpty().withMessage('League is required.'),

  check('teamA').exists().notEmpty().withMessage('First team is required.'),

  check('teamB').exists().notEmpty().withMessage('Second team is required.'),

  check('date')
    .exists()
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Date should has ISO format.'),

  check('profit').exists().notEmpty().isNumeric().isInt(),

  check('percentage').exists().notEmpty().isNumeric().isInt(),

  check('description')
    .exists()
    .notEmpty()
    .withMessage('Description is required'),

  check('isFree')
    .optional()
    .exists()
    .withMessage('isFree is required')
    .notEmpty()
    .withMessage('isFree cant be empty')
    .isBoolean()
    .withMessage('isFree needs to be a boolean'),

  check('status').exists().notEmpty().withMessage('Status is required.'),

  check('status').custom((value: BetEnum) => {
    if (!Object.values(BetEnum).includes(value)) {
      throw new Error('Invalid bet status'); //
    }
    return true;
  }),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const betStatusUpdateValidator = [
  check('id').exists().notEmpty().isMongoId(),

  check('status').exists().notEmpty(),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const betValidatorDelete = [
  check('id').exists().notEmpty().isMongoId(),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

export {
  betValidatorCreate,
  betValidatorUpdate,
  betValidatorDelete,
  betStatusUpdateValidator
};
