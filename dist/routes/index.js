"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clubs_1 = __importDefault(require("./clubs"));
const users_1 = __importDefault(require("./users"));
const auth_1 = __importDefault(require("./auth"));
const videos_1 = __importDefault(require("./videos"));
function routerApi(app) {
    const router = express_1.default.Router();
    app.use('/api', router);
    router.use(clubs_1.default);
    router.use(users_1.default);
    router.use(auth_1.default);
    router.use(videos_1.default);
}
exports.default = routerApi;
