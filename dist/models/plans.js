"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const plansSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },
    durationInWeeks: {
        type: Number
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('plans', plansSchema);
