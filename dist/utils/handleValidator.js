"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
function validateResults(req, res, next) {
    try {
        (0, express_validator_1.validationResult)(req).throw();
        return next();
    }
    catch (error) {
        res.status(400);
        res.send({
            errors: error.array()
        });
    }
}
exports.default = validateResults;
