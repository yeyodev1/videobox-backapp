"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sportValidatorDetail = exports.sportValidatorDelete = exports.sportValidatorUpdate = exports.sportValidatorCreate = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = __importDefault(require("../utils/handleValidator"));
const sportValidatorCreate = [
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
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.sportValidatorCreate = sportValidatorCreate;
const sportValidatorUpdate = [
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
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.sportValidatorUpdate = sportValidatorUpdate;
const sportValidatorDetail = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.sportValidatorDetail = sportValidatorDetail;
const sportValidatorDelete = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.sportValidatorDelete = sportValidatorDelete;
