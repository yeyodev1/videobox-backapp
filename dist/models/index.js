"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clubs_1 = __importDefault(require("./clubs"));
const clubImages_1 = __importDefault(require("./clubImages"));
const users_1 = __importDefault(require("./users"));
const userImages_1 = __importDefault(require("./userImages"));
const padelVideos_1 = __importDefault(require("./padelVideos"));
const models = {
    clubs: clubs_1.default,
    clubImages: clubImages_1.default,
    users: users_1.default,
    userImages: userImages_1.default,
    padelVideos: padelVideos_1.default,
};
exports.default = models;
