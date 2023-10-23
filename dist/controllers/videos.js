"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relateUserWithVideo = exports.uploadPadelVideo = exports.getVideos = void 0;
const gcpImageUpload_1 = __importDefault(require("../services/gcpImageUpload"));
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const index_1 = __importDefault(require("../models/index"));
const handleImageUrl_1 = require("../utils/handleImageUrl");
async function getVideos(_req, res) {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const videos = await index_1.default.padelVideos.find({
            createdAt: { $gte: sevenDaysAgo }
        });
        res.send({ data: videos });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'CANNOT_GET_VIDEOS', 403);
    }
}
exports.getVideos = getVideos;
async function uploadPadelVideo(req, res) {
    try {
        const { file } = req;
        const response = await (0, gcpImageUpload_1.default)(file, 'video');
        const result = (0, handleImageUrl_1.addPrefixUrl)(response, 'video');
        const fileData = {
            url: result,
            filename: result.split('/')[2],
            fileId: file === null || file === void 0 ? void 0 : file.originalname
        };
        const data = await index_1.default.padelVideos.create(fileData);
        res.send({ data });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Error uploading file');
    }
}
exports.uploadPadelVideo = uploadPadelVideo;
async function relateUserWithVideo(req, res) {
    try {
        const email = req.params.userId;
        const videoId = req.params.videoId;
        const user = await index_1.default.users.findOne({ email: email });
        if (!user) {
            (0, handleErrors_1.default)(res, 'Not found by email');
        }
        const video = await index_1.default.padelVideos.findById(videoId);
        if (!video) {
            (0, handleErrors_1.default)(res, 'Not found by Id');
        }
        user === null || user === void 0 ? void 0 : user.videos.push(videoId);
        await (user === null || user === void 0 ? void 0 : user.save());
        res.send({
            message: 'VIDEO RELEASED SUCCESSFULLY'
        });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'CANNOT RELATE MODELS');
    }
}
exports.relateUserWithVideo = relateUserWithVideo;
