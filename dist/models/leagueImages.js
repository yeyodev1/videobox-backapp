"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leagueImagesSchema = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    url: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('leagueImages', leagueImagesSchema);
