import express from 'express';

import {
  authValidatorRegister,
  authValidatorlogin,
  authUpdatePassword,
  authRecoverPasswordRequest,
} from '../validators/auth';
import {
  createAuthRegisterController,
  authLoginController,
  updatePasswordAndNotify,
  passwordRecoveryRequestController
} from '../controllers/auth';

const router = express.Router();

router.post(
  '/auth/register',
  authValidatorRegister,
  createAuthRegisterController
);

router.post('/auth/login', authValidatorlogin, authLoginController);

// TODO: set password recovery request
router.post(
  '/auth/password-recovery-request',
  authRecoverPasswordRequest,
  passwordRecoveryRequestController
);

// TODO: update password
router.patch(
  '/auth/password-recovery',
  authUpdatePassword,
  updatePasswordAndNotify
);

export default router;
