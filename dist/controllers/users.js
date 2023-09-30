"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.uploadUserImage = exports.updateUser = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const imagesEnum_1 = require("../enum/imagesEnum");
const gcpImageUpload_1 = __importDefault(require("../services/gcpImageUpload"));
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const handleImageUrl_1 = require("../utils/handleImageUrl");
const index_1 = __importDefault(require("../models/index"));
async function getUsers(_req, res) {
    try {
        const users = await index_1.default.users.find({});
        res.send(users);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get users');
    }
}
exports.getUsers = getUsers;
async function uploadUserImage(req, res) {
    try {
        const { file } = req;
        const response = await (0, gcpImageUpload_1.default)(file, imagesEnum_1.ImagesEnum.USER);
        const result = (0, handleImageUrl_1.addPrefixUrl)(response, imagesEnum_1.ImagesEnum.USER);
        const fileData = {
            url: result,
            filename: result.split('/')[2]
        };
        const data = await index_1.default.userImages.create(fileData);
        res.send({ data });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Error uploading file');
    }
}
exports.uploadUserImage = uploadUserImage;
async function updateUser(req, res) {
    try {
        const id = req.params.id;
        const body = (0, express_validator_1.matchedData)(req);
        await index_1.default.users.findByIdAndUpdate(id, body);
        res.send({
            message: 'User updated'
        });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot update user');
    }
}
exports.updateUser = updateUser;
async function getUser(req, res) {
    try {
        const id = req.body.id;
        const user = await index_1.default.users.findById(id);
        if (!user) {
            (0, handleErrors_1.default)(res, 'Usuario no existe');
            return;
        }
        const data = {
            name: user === null || user === void 0 ? void 0 : user.name,
            lastname: user === null || user === void 0 ? void 0 : user.lastname,
            userImage: user === null || user === void 0 ? void 0 : user.userImage,
            id: user === null || user === void 0 ? void 0 : user._id,
            role: user === null || user === void 0 ? void 0 : user.role,
            email: user.email,
            birthdate: user === null || user === void 0 ? void 0 : user.birthdate,
            twitter: user === null || user === void 0 ? void 0 : user.twitter,
            instagram: user === null || user === void 0 ? void 0 : user.instagram,
            susbcriptionStatus: user === null || user === void 0 ? void 0 : user.subscriptionStatus,
            subscriptionExpirationDate: user === null || user === void 0 ? void 0 : user.subscriptionExpirationDate,
            emailVerified: user.emailVerified
        };
        res.send({ data });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot login');
    }
}
exports.getUser = getUser;
