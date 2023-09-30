"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidatorUpdate = void 0;
const express_validator_1 = require("express-validator");
const handleValidator_1 = __importDefault(require("../utils/handleValidator"));
const userValidatorUpdate = [
    (0, express_validator_1.check)('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .isLength({ max: 20 })
        .withMessage('Max Length 20 characters'),
    (0, express_validator_1.check)('lastname')
        .optional()
        .isString()
        .withMessage('LastName is required')
        .isLength({ max: 30 })
        .withMessage('Max Length 30 characters'),
    (0, express_validator_1.check)('userImage').optional().isURL().withMessage('Invalid image URL'),
    (0, express_validator_1.check)('phone').optional().isNumeric().withMessage('Phone must be a number'),
    (req, res, next) => {
        return (0, handleValidator_1.default)(req, res, next);
    }
];
exports.userValidatorUpdate = userValidatorUpdate;
