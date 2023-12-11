import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';

import validateResults from '../utils/handleValidator';

const authValidatorRegister = [
  check('email')
    .notEmpty()
    .withMessage('Mail is required')
    .isEmail()
    .withMessage('Invalid email format'),

  check('password')
    .notEmpty()
    .withMessage('No password found')
    .isLength({ min: 4 })
    .withMessage('Min Length 8 characters')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),

  check('birthdate')
    .exists()
    .notEmpty()
    .isISO8601()
    .withMessage('Date is required'),

  check('role').optional(),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const authValidatorlogin = [
  check('email').exists().notEmpty().isEmail(),

  check('password').exists().notEmpty().isLength({ min: 8 }),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const authRecoverPasswordRequest = [
  check('email').exists().notEmpty().isEmail(),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

const authUpdatePassword = [
  check('password').exists().notEmpty().isLength({ min: 8 }),

  (req: Request, res: Response, next: NextFunction) => {
    return validateResults(req, res, next);
  }
];

export {
  authValidatorRegister,
  authValidatorlogin,
  authRecoverPasswordRequest,
  authUpdatePassword,
};
