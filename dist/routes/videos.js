"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videos_1 = require("../controllers/videos");
const handleImage_1 = __importDefault(require("../middlewares/handleImage"));
const router = express_1.default.Router();
router.get('/videos', videos_1.getVideos);
router.post('/upload-video', handleImage_1.default.single('video'), videos_1.uploadPadelVideo);
exports.default = router;
