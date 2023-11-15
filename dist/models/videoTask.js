"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = __importDefault(require("mongoose"));
const videoTaskChema = new mongoose_2.default.Schema({
    taskId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'error'],
        default: 'pending',
    },
    url: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model('VideoTask', videoTaskChema);
