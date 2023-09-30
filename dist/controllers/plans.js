"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPlanImage = exports.deletePlan = exports.updatePlan = exports.createPlan = exports.getPlans = void 0;
const express_validator_1 = require("express-validator");
const gcpImageUpload_1 = __importDefault(require("../services/gcpImageUpload"));
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const imagesEnum_1 = require("../enum/imagesEnum");
const handleImageUrl_1 = require("../utils/handleImageUrl");
const index_1 = __importDefault(require("../models/index"));
async function getPlans(_req, res) {
    try {
        const plans = await index_1.default.plans.find({});
        res.send(plans);
    }
    catch (error) {
        console.log(error);
        (0, handleErrors_1.default)(res, 'Cannot get plans');
    }
}
exports.getPlans = getPlans;
async function uploadPlanImage(req, res) {
    try {
        const { file } = req;
        const response = await (0, gcpImageUpload_1.default)(file, imagesEnum_1.ImagesEnum.PLAN);
        const result = (0, handleImageUrl_1.addPrefixUrl)(response, imagesEnum_1.ImagesEnum.PLAN);
        const fileData = {
            url: result,
            filename: result.split('/')[2]
        };
        const data = await index_1.default.planImages.create(fileData);
        res.send({ data });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Error uploading file');
    }
}
exports.uploadPlanImage = uploadPlanImage;
async function createPlan(req, res) {
    const { body } = req;
    try {
        const newPlan = await index_1.default.plans.create(body);
        res.send(newPlan);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot create plan');
    }
}
exports.createPlan = createPlan;
async function updatePlan(req, res) {
    try {
        const { id, ...body } = (0, express_validator_1.matchedData)(req);
        await index_1.default.plans.findByIdAndUpdate(id, body);
        res.send({
            message: 'Plan updated'
        });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot update plan');
    }
}
exports.updatePlan = updatePlan;
async function deletePlan(req, res) {
    try {
        const { id } = (0, express_validator_1.matchedData)(req);
        await index_1.default.plans.findOneAndDelete({ _id: id });
        res.send({ message: 'Plan deleted successfully' });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot delete plan');
    }
}
exports.deletePlan = deletePlan;
