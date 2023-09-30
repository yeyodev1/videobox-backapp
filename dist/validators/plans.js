"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planValidatorDelete = exports.planValidatorUpdate = exports.planValidatorCreate = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = __importDefault(require("../utils/handleValidator"));
const planValidatorCreate = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .isString()
        .withMessage('Name is required')
        .isLength({ max: 20 })
        .withMessage('Max Length 20 characters'),
    (0, express_validator_1.check)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Max Length 500 characters'),
    (0, express_validator_1.check)('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Only number is allowed'),
    (0, express_validator_1.check)('image')
        .notEmpty()
        .withMessage('Image is required')
        .isURL()
        .withMessage('No image URL'),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.planValidatorCreate = planValidatorCreate;
const planValidatorUpdate = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (0, express_validator_1.check)('name')
        .notEmpty()
        .isString()
        .withMessage('Name is required')
        .isLength({ max: 20 })
        .withMessage('Max Length 20 characters'),
    (0, express_validator_1.check)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Max Length 500 characters'),
    (0, express_validator_1.check)('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Only number is allowed'),
    (0, express_validator_1.check)('image')
        .notEmpty()
        .withMessage('Image is required')
        .isURL()
        .withMessage('No image URL'),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.planValidatorUpdate = planValidatorUpdate;
const planValidatorDelete = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.planValidatorDelete = planValidatorDelete;
