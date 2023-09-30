"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_1 = require("../controllers/subscription");
const HandleBearer_1 = require("../middlewares/HandleBearer");
const router = express_1.default.Router();
router.patch('/subscription', HandleBearer_1.authenticateToken, subscription_1.updateSubscription);
router.patch('/remove-subscription', HandleBearer_1.authenticateToken, subscription_1.removeSubscription);
exports.default = router;
