"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadClubImage = exports.deleteClub = exports.updateClub = exports.createClub = exports.getClubs = void 0;
const express_validator_1 = require("express-validator");
const gcpImageUpload_1 = __importDefault(require("../services/gcpImageUpload"));
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const imagesEnum_1 = require("../enum/imagesEnum");
const handleImageUrl_1 = require("../utils/handleImageUrl");
const index_1 = __importDefault(require("../models/index"));
async function getClubs(_req, res) {
    try {
        const clubs = await index_1.default.clubs.find({});
        res.send(clubs);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get clubs');
    }
}
exports.getClubs = getClubs;
async function uploadClubImage(req, res) {
    try {
        const { file } = req;
        const response = await (0, gcpImageUpload_1.default)(file, imagesEnum_1.ImagesEnum.CLUB);
        const result = (0, handleImageUrl_1.addPrefixUrl)(response, imagesEnum_1.ImagesEnum.CLUB);
        const fileData = {
            url: result,
            filename: result.split('/')[2]
        };
        const data = await index_1.default.clubImages.create(fileData);
        res.send({ data });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Error uploading file');
    }
}
exports.uploadClubImage = uploadClubImage;
async function createClub(req, res) {
    const { body } = req;
    try {
        const newClub = await index_1.default.clubs.create(body);
        res.send(newClub);
        console.log(newClub);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot create club');
    }
}
exports.createClub = createClub;
async function updateClub(req, res) {
    try {
        const { id, ...body } = (0, express_validator_1.matchedData)(req);
        await index_1.default.clubs.findByIdAndUpdate(id, body);
        res.send({
            message: 'Club updated'
        });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot update club');
    }
}
exports.updateClub = updateClub;
async function deleteClub(req, res) {
    try {
        await index_1.default.clubs.findOneAndDelete({ _id: req.params.id });
        res.send({ message: 'Club deleted successfully' });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot delete club');
    }
}
exports.deleteClub = deleteClub;
