"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const betEnum_1 = require("../enum/betEnum");
const betsSchema = new mongoose_1.default.Schema({
    sport: {
        type: String
    },
    league: {
        type: String
    },
    teamA: {
        type: String
    },
    teamB: {
        type: String
    },
    date: {
        type: Date
    },
    profit: {
        type: Number
    },
    percentage: {
        type: Number
    },
    description: {
        type: String
    },
    isFree: {
        type: Boolean
    },
    status: {
        type: String,
        enum: Object.values(betEnum_1.BetEnum),
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('bets', betsSchema);
