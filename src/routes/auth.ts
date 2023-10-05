import express from 'express';

import {
  authRecoverPasswordRequest,
  authValidatorRegister,
  authValidatorlogin,
  authUpdatePassword,
} from '../validators/auth';
import {
  createAuthRegisterController,
  authLoginController,
  passwordRecoveryRequestController,
  updatePasswordAndNotify
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
