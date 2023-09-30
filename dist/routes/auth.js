"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../validators/auth");
const auth_2 = require("../controllers/auth");
const router = express_1.default.Router();
router.post('/auth/register', auth_1.authValidatorRegister, auth_2.createAuthRegisterController);
router.post('/auth/login', auth_1.authValidatorlogin, auth_2.authLoginController);
// TODO: verify email
router.patch('/auth/email-verification', auth_1.authEmailVerificationValidator, auth_2.emailVerificationController);
// TODO: set password recovery request
router.post('/auth/password-recovery-request', auth_1.authRecoverPasswordRequest, auth_2.passwordRecoveryRequestController);
// TODO: update password
router.patch('/auth/password-recovery', auth_1.authUpdatePassword, auth_1.authEmailVerificationValidator, auth_2.updatePasswordAndNotify);
exports.default = router;
