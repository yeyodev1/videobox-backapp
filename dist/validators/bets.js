"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.betStatusUpdateValidator = exports.betValidatorDelete = exports.betValidatorUpdate = exports.betValidatorCreate = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = __importDefault(require("../utils/handleValidator"));
const betEnum_1 = require("../enum/betEnum");
const betValidatorCreate = [
    (0, express_validator_1.check)('sport').exists().notEmpty().withMessage('Sport is required.'),
    (0, express_validator_1.check)('league').exists().notEmpty().withMessage('League is required.'),
    (0, express_validator_1.check)('teamA').exists().notEmpty().withMessage('First team is required.'),
    (0, express_validator_1.check)('teamB').exists().notEmpty().withMessage('Second team is required.'),
    (0, express_validator_1.check)('date')
        .exists()
        .notEmpty()
        .withMessage('Date is required.')
        .isISO8601()
        .withMessage('Date should has ISO format.'),
    (0, express_validator_1.check)('profit').exists().notEmpty().isNumeric().isInt(),
    (0, express_validator_1.check)('percentage').exists().notEmpty().isNumeric().isInt(),
    (0, express_validator_1.check)('description')
        .exists()
        .notEmpty()
        .withMessage('Description is required'),
    (0, express_validator_1.check)('isFree')
        .exists()
        .withMessage('isFree is required')
        .notEmpty()
        .withMessage('isFree cant be empty')
        .isBoolean()
        .withMessage('isFree needs to be a boolean'),
    (0, express_validator_1.check)('status').exists().notEmpty().withMessage('Status is required.'),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.betValidatorCreate = betValidatorCreate;
const betValidatorUpdate = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (0, express_validator_1.check)('sport').exists().notEmpty().withMessage('Sport is required.'),
    (0, express_validator_1.check)('league').exists().notEmpty().withMessage('League is required.'),
    (0, express_validator_1.check)('teamA').exists().notEmpty().withMessage('First team is required.'),
    (0, express_validator_1.check)('teamB').exists().notEmpty().withMessage('Second team is required.'),
    (0, express_validator_1.check)('date')
        .exists()
        .notEmpty()
        .withMessage('Date is required.')
        .isISO8601()
        .withMessage('Date should has ISO format.'),
    (0, express_validator_1.check)('profit').exists().notEmpty().isNumeric().isInt(),
    (0, express_validator_1.check)('percentage').exists().notEmpty().isNumeric().isInt(),
    (0, express_validator_1.check)('description')
        .exists()
        .notEmpty()
        .withMessage('Description is required'),
    (0, express_validator_1.check)('isFree')
        .optional()
        .exists()
        .withMessage('isFree is required')
        .notEmpty()
        .withMessage('isFree cant be empty')
        .isBoolean()
        .withMessage('isFree needs to be a boolean'),
    (0, express_validator_1.check)('status').exists().notEmpty().withMessage('Status is required.'),
    (0, express_validator_1.check)('status').custom((value) => {
        if (!Object.values(betEnum_1.BetEnum).includes(value)) {
            throw new Error('Invalid bet status'); //
        }
        return true;
    }),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.betValidatorUpdate = betValidatorUpdate;
const betStatusUpdateValidator = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (0, express_validator_1.check)('status').exists().notEmpty(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.betStatusUpdateValidator = betStatusUpdateValidator;
const betValidatorDelete = [
    (0, express_validator_1.check)('id').exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.betValidatorDelete = betValidatorDelete;
