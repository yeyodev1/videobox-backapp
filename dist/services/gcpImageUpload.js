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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@google-cloud/storage");
const url_1 = require("url");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const storage = new storage_1.Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: (_a = process.env.PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.split(String.raw `\n`).join('\n')
    }
});
const bucketName = 'predix-images';
const bucket = storage.bucket(bucketName);
async function gcpImageUpload(file, location) {
    try {
        const ext = file.originalname.split('.').pop();
        const string = file.originalname.split('.').shift();
        const name = string === null || string === void 0 ? void 0 : string.replace(/\s/g, '_');
        const filename = `file-${Date.now()}-${name}.${ext}`;
        const blob = bucket.file(location + filename);
        const blobStream = blob.createWriteStream({
            resumable: false
        });
        const publicUrl = await new Promise((resolve, reject) => {
            blobStream
                .on('error', (error) => {
                console.log(error);
                reject('Error happened on image upload');
            })
                .on('finish', () => {
                const publicUrl = (0, url_1.format)(`https://storage.googleapis.com/${bucket.name}/${filename}`);
                resolve(publicUrl);
            })
                .end(file.buffer);
        });
        return publicUrl;
    }
    catch (error) {
        console.log(error);
        return 'Cannot upload image';
    }
}
exports.default = gcpImageUpload;
