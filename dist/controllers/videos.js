"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVideoStatus = exports.cutVideo = exports.relateUserWithVideo = exports.uploadPadelVideo = exports.getVideos = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const gcpImageUpload_1 = __importDefault(require("../services/gcpImageUpload"));
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const index_1 = __importDefault(require("../models/index"));
const handleImageUrl_1 = require("../utils/handleImageUrl");
const gcpVideoUpload_1 = require("../services/gcpVideoUpload");
const child_process_1 = require("child_process");
const videoTask_1 = __importDefault(require("../models/videoTask"));
async function getVideos(_req, res) {
    try {
        // const now = new Date();
        // const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        // const videos = await models.padelVideos.find({
        //   createdAt: { $gte: sevenDaysAgo }
        // });
        const videos = await index_1.default.padelVideos.find({});
        console.log(videos);
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
function timeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
async function cutVideo(req, res) {
    const { startTime, endTime, videoId } = req.body;
    const taskId = `task_${Date.now()}`; // Generamos un identificador único para la tarea.
    const newTask = new videoTask_1.default({ taskId, status: 'pending' });
    await newTask.save();
    res.status(202).json({ message: 'El proceso de corte de video ha comenzado.', taskId });
    processVideoCut(startTime, endTime, videoId, taskId);
}
exports.cutVideo = cutVideo;
async function processVideoCut(startTime, endTime, videoId, taskId) {
    try {
        const video = await index_1.default.padelVideos.findById(videoId);
        if (!video) {
            await videoTask_1.default.updateOne({ taskId }, { status: 'error' });
            return;
        }
        const temp = '/tmp';
        if (!fs_1.default.existsSync(temp)) {
            fs_1.default.mkdirSync(temp);
        }
        const outputFilename = `cut_${Date.now()}.mp4`;
        const outputPath = path_1.default.join(temp, outputFilename);
        const ffmpegPath = 'ffmpeg';
        const startTimeInSeconds = timeToSeconds(startTime);
        const duration = timeToSeconds(endTime) - startTimeInSeconds;
        const args = ['-ss', String(startTimeInSeconds), '-i', video.url, '-t', String(duration), '-c', 'copy', outputPath];
        const child = (0, child_process_1.spawn)(ffmpegPath, args);
        child.on('exit', async (code) => {
            if (code !== 0) {
                await videoTask_1.default.updateOne({ taskId }, { status: 'error' });
                return;
            }
            const publicUrl = await (0, gcpVideoUpload_1.uploadVideoToGCS)(outputPath);
            fs_1.default.unlinkSync(outputPath);
            await videoTask_1.default.updateOne({ taskId }, { status: 'completed', url: publicUrl });
        });
        child.on('error', async (error) => {
            await videoTask_1.default.updateOne({ taskId }, { status: 'error', description: JSON.stringify(error) });
        });
    }
    catch (error) {
        await videoTask_1.default.updateOne({ taskId }, { status: 'error', description: JSON.stringify(error) });
    }
}
async function checkVideoStatus(req, res) {
    const { taskId } = req.params;
    const task = await videoTask_1.default.findOne({ taskId });
    if (!task) {
        return (0, handleErrors_1.default)(res, 'TASK_NOT_FOUND', 404);
    }
    switch (task.status) {
        case 'pending':
            res.status(200).json({ message: 'Video aún en proceso.' });
            break;
        case 'completed':
            res.status(200).json({ message: 'Video procesado.', url: task.url });
            break;
        case 'error':
            (0, handleErrors_1.default)(res, 'PROCESSING_ERROR', 500);
            break;
    }
}
exports.checkVideoStatus = checkVideoStatus;
