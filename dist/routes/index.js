"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plans_1 = __importDefault(require("./plans"));
const sports_1 = __importDefault(require("./sports"));
const leagues_1 = __importDefault(require("./leagues"));
const bets_1 = __importDefault(require("./bets"));
const users_1 = __importDefault(require("./users"));
const auth_1 = __importDefault(require("./auth"));
const subscription_1 = __importDefault(require("./subscription"));
function routerApi(app) {
    const router = express_1.default.Router();
    app.use('/api', router);
    router.use(plans_1.default);
    router.use(sports_1.default);
    router.use(leagues_1.default);
    router.use(bets_1.default);
    router.use(users_1.default);
    router.use(auth_1.default);
    router.use(subscription_1.default);
}
exports.default = routerApi;
