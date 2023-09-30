"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leagueValidatorDelete = exports.leagueValidatorUpdate = exports.leagueValidatorCreate = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = __importDefault(require("../utils/handleValidator"));
const leagueValidatorCreate = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .isString()
        .withMessage('Name is required')
        .isLength({ max: 20 })
        .withMessage('Max Length 20 characters'),
    (0, express_validator_1.check)('image')
        .notEmpty()
        .withMessage('Image is required')
        .isURL()
        .withMessage('No image URL'),
    (0, express_validator_1.check)('sport')
        .exists()
        .isMongoId()
        .withMessage('Sport reference is required'),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.leagueValidatorCreate = leagueValidatorCreate;
const leagueValidatorUpdate = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (0, express_validator_1.check)('name')
        .notEmpty()
        .isString()
        .withMessage('Name is required')
        .isLength({ max: 20 })
        .withMessage('Max Length 20 characters'),
    (0, express_validator_1.check)('image')
        .notEmpty()
        .withMessage('Image is required')
        .isURL()
        .withMessage('No image URL'),
    (0, express_validator_1.check)('sport')
        .exists()
        .isMongoId()
        .withMessage('Sport reference is required'),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.leagueValidatorUpdate = leagueValidatorUpdate;
const leagueValidatorDelete = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.leagueValidatorDelete = leagueValidatorDelete;
