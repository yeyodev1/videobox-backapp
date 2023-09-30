"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLeagueImage = exports.deleteLeague = exports.updateLeague = exports.createLeague = exports.getLeagues = void 0;
const express_validator_1 = require("express-validator");
const gcpImageUpload_1 = __importDefault(require("../services/gcpImageUpload"));
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const imagesEnum_1 = require("../enum/imagesEnum");
const handleImageUrl_1 = require("../utils/handleImageUrl");
const index_1 = __importDefault(require("../models/index"));
async function getLeagues(_req, res) {
    try {
        const leagues = await index_1.default.leagues.find({});
        res.send(leagues);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get leagues');
    }
}
exports.getLeagues = getLeagues;
async function uploadLeagueImage(req, res) {
    try {
        const { file } = req;
        const response = await (0, gcpImageUpload_1.default)(file, imagesEnum_1.ImagesEnum.LEAGUE);
        const result = (0, handleImageUrl_1.addPrefixUrl)(response, imagesEnum_1.ImagesEnum.LEAGUE);
        const fileData = {
            url: result,
            filename: result.split('/')[2]
        };
        const data = await index_1.default.leagueImages.create(fileData);
        res.send({ data });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Error uploading file');
    }
}
exports.uploadLeagueImage = uploadLeagueImage;
async function createLeague(req, res) {
    const { body } = req;
    try {
        const newleague = await index_1.default.leagues.create(body);
        res.send(newleague);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot create leagues');
    }
}
exports.createLeague = createLeague;
async function updateLeague(req, res) {
    try {
        const { id, ...body } = (0, express_validator_1.matchedData)(req);
        await index_1.default.leagues.findByIdAndUpdate(id, body);
        res.send({
            message: 'League updated'
        });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot update league');
    }
}
exports.updateLeague = updateLeague;
async function deleteLeague(req, res) {
    try {
        await index_1.default.leagues.findOneAndDelete({ _id: req.params.id });
        res.send({ message: 'League deleted successfully' });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot delete league');
    }
}
exports.deleteLeague = deleteLeague;
