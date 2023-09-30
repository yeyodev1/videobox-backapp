import express from 'express';

import {
  authRecoverPasswordRequest,
  authValidatorRegister,
  authValidatorlogin,
  authUpdatePassword,
  authEmailVerificationValidator
} from '../validators/auth';
import {
  createAuthRegisterController,
  authLoginController,
  emailVerificationController,
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

// TODO: verify email
router.patch(
  '/auth/email-verification',
  authEmailVerificationValidator,
  emailVerificationController
);

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
  authEmailVerificationValidator,
  updatePasswordAndNotify
);

export default router;
