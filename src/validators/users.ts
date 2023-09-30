import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';

import validateResults from '../utils/handleValidator';

const userValidatorUpdate = [
  check('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 20 })
    .withMessage('Max Length 20 characters'),

  check('lastname')
    .optional()
    .isString()
    .withMessage('LastName is required')
    .isLength({ max: 30 })
    .withMessage('Max Length 30 characters'),

  check('userImage').optional().isURL().withMessage('Invalid image URL'),

  check('phone').optional().isNumeric().withMessage('Phone must be a number'),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

export { userValidatorUpdate };
