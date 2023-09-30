"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sports_1 = __importDefault(require("./sports"));
const plans_1 = __importDefault(require("./plans"));
const planImages_1 = __importDefault(require("./planImages"));
const clubs_1 = __importDefault(require("./clubs"));
const sportImages_1 = __importDefault(require("./sportImages"));
const clubImages_1 = __importDefault(require("./clubImages"));
const bets_1 = __importDefault(require("./bets"));
const users_1 = __importDefault(require("./users"));
const userImages_1 = __importDefault(require("./userImages"));
const models = {
    plans: plans_1.default,
    sports: sports_1.default,
    clubs: clubs_1.default,
    planImages: planImages_1.default,
    sportImages: sportImages_1.default,
    clubImages: clubImages_1.default,
    bets: bets_1.default,
    users: users_1.default,
    userImages: userImages_1.default
};
exports.default = models;
