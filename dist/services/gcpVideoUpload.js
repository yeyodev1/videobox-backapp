"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoToGCS = exports.gcpVideoUpload = void 0;
const storage_1 = require("@google-cloud/storage");
const url_1 = require("url");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
dotenv.config();
const storage = new storage_1.Storage({
    projectId: process.env.BUCKET_PROJECT_ID,
    credentials: {
        client_email: process.env.BUCKET_CLIENT_EMAIL,
        private_key: (_a = process.env.BUCKET_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.split(String.raw `\n`).join('\n')
    }
});
const bucketName = 'videbox-bucket';
const bucket = storage.bucket(bucketName);
async function gcpVideoUpload(stream, filename) {
    try {
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
            resumable: false
        });
        console.log(filename);
        const publicUrl = await new Promise((resolve, reject) => {
            blobStream
                .on('error', (error) => {
                reject('Error happened on video upload: ' + error.message);
            })
                .on('finish', () => {
                const publicUrl = (0, url_1.format)(`https://storage.googleapis.com/${bucket.name}/${filename}`);
                resolve(publicUrl);
            });
            stream.pipe(blobStream);
        });
        return publicUrl;
    }
    catch (error) {
        console.error('Cannot upload video: ', error);
        throw error;
    }
}
exports.gcpVideoUpload = gcpVideoUpload;
async function uploadVideoToGCS(filePath) {
    return new Promise((resolve, reject) => {
        const filename = path_1.default.basename(filePath);
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
            resumable: true,
            metadata: {
                contentType: 'video/mp4',
            },
        });
        blobStream.on('error', (error) => {
            reject(error);
        });
        blobStream.on('finish', () => {
            blob.makePublic().then(() => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                resolve(publicUrl);
            }).catch(reject);
        });
        (0, fs_1.createReadStream)(filePath).pipe(blobStream);
    });
}
exports.uploadVideoToGCS = uploadVideoToGCS;
