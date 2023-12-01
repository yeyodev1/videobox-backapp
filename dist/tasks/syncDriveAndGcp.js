"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const gcpDriveApi_1 = __importDefault(require("../services/gcpDriveApi"));
const gcpVideoUpload_1 = require("../services/gcpVideoUpload");
const index_1 = __importDefault(require("../models/index"));
async function syncDriveToGcp() {
    try {
        const driveManager = new gcpDriveApi_1.default();
        const folderId = 'Test Media Player';
        const gcsBucketFoler = 'video';
        const videoLinks = await driveManager.getDirectVideoLinksInFolder(folderId);
        const accessToken = await driveManager.getAccessToken();
        if (!videoLinks.length) {
            return;
        }
        for (const videoLink of videoLinks) {
            const videoDownloadLink = `https://www.googleapis.com/drive/v3/files/${videoLink.directLink}?alt=media`;
            const videoName = videoLink.name;
            const gcsLocation = gcsBucketFoler + videoName;
            const response = await axios_1.default.get(videoDownloadLink, {
                headers: { Authorization: `Bearer ${accessToken.token}` },
                responseType: 'stream'
            });
            const publicUrl = await (0, gcpVideoUpload_1.gcpVideoUpload)(response.data, gcsLocation);
            const fileData = {
                name: videoName,
                url: publicUrl,
                fileId: videoLink.directLink
            };
            await index_1.default.padelVideos.create(fileData);
        }
        // await driveManager.deleteAllFilesInFolder(folderId);
    }
    catch (error) {
        console.log(error);
    }
}
exports.default = syncDriveToGcp;
