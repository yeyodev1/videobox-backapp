"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideos = void 0;
const gcpDriveApi_1 = __importDefault(require("../services/gcpDriveApi"));
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const videoManager = new gcpDriveApi_1.default();
async function getVideos(_req, res) {
    try {
        const folderId = 'Test Media Player';
        const videos = await videoManager.getDownloadLinksInFolder(folderId);
        res.send({ data: videos });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'CANNOT_GET_VIDEOS', 403);
    }
}
exports.getVideos = getVideos;
