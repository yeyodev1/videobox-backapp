"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authEmailVerificationValidator = exports.authUpdatePassword = exports.authRecoverPasswordRequest = exports.authValidatorlogin = exports.authValidatorRegister = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = __importDefault(require("../utils/handleValidator"));
const authValidatorRegister = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Mail is required')
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.check)('password')
        .notEmpty()
        .withMessage('No password found')
        .isLength({ min: 8 })
        .withMessage('Min Length 8 characters')
        .matches(/\W/)
        .withMessage('Password must contain at least one symbol')
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string'),
    (0, express_validator_1.check)('birthdate')
        .exists()
        .notEmpty()
        .isISO8601()
        .withMessage('Date is required'),
    (0, express_validator_1.check)('role').optional(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.authValidatorRegister = authValidatorRegister;
const authValidatorlogin = [
    (0, express_validator_1.check)('email').exists().notEmpty().isEmail(),
    (0, express_validator_1.check)('password').exists().notEmpty().isLength({ min: 8 }),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.authValidatorlogin = authValidatorlogin;
const authRecoverPasswordRequest = [
    (0, express_validator_1.check)('email').exists().notEmpty().isEmail(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.authRecoverPasswordRequest = authRecoverPasswordRequest;
const authUpdatePassword = [
    (0, express_validator_1.check)('password').exists().notEmpty().isLength({ min: 8 }),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.authUpdatePassword = authUpdatePassword;
const authEmailVerificationValidator = [
    (0, express_validator_1.check)('id').exists().notEmpty(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.authEmailVerificationValidator = authEmailVerificationValidator;
