"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leaguesSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true
    },
    image: {
        type: String
    },
    sport: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'sports'
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('leagues', leaguesSchema);
