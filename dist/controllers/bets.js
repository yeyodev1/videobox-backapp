"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBetsPremiumPending = exports.getBetsFreePending = exports.updateBetStatus = exports.deleteBet = exports.updateBet = exports.createBet = exports.getBet = exports.getBetsFree = exports.getBetsPendings = exports.getBets = void 0;
const express_validator_1 = require("express-validator");
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const index_1 = __importDefault(require("../models/index"));
const betEnum_1 = require("../enum/betEnum");
async function getBets(_req, res) {
    try {
        const bets = await index_1.default.bets.find({});
        res.send(bets);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get bets');
    }
}
exports.getBets = getBets;
async function getBetsPendings(_req, res) {
    try {
        const pendingBets = await index_1.default.bets.find({ status: betEnum_1.BetEnum.PENDING });
        res.send(pendingBets);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get Pending bets');
    }
}
exports.getBetsPendings = getBetsPendings;
async function getBetsFreePending(_req, res) {
    try {
        const freePendingBets = await index_1.default.bets.find({
            isFree: true,
            status: betEnum_1.BetEnum.PENDING
        });
        res.send(freePendingBets);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get pending and free bets');
    }
}
exports.getBetsFreePending = getBetsFreePending;
async function getBetsPremiumPending(_req, res) {
    try {
        const freePendingBets = await index_1.default.bets.find({
            isFree: false,
            status: betEnum_1.BetEnum.PENDING
        });
        res.send(freePendingBets);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get pending and free bets');
    }
}
exports.getBetsPremiumPending = getBetsPremiumPending;
async function getBetsFree(_req, res) {
    try {
        const freeBets = await index_1.default.bets.find({ isFree: true });
        res.send(freeBets);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get Free bets');
    }
}
exports.getBetsFree = getBetsFree;
async function getBet(req, res) {
    try {
        const id = req.params.id;
        const data = await index_1.default.bets.findById({ _id: id });
        res.send({ data });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot get bet');
    }
}
exports.getBet = getBet;
async function createBet(req, res) {
    const { body } = req;
    try {
        const newBet = await index_1.default.bets.create(body);
        res.send(newBet);
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot create bet');
    }
}
exports.createBet = createBet;
async function updateBet(req, res) {
    try {
        const { id, ...body } = (0, express_validator_1.matchedData)(req);
        await index_1.default.bets.findByIdAndUpdate(id, body);
        res.send({
            message: 'Bet updated'
        });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot update bet');
    }
}
exports.updateBet = updateBet;
async function updateBetStatus(req, res) {
    try {
        const { id, ...body } = (0, express_validator_1.matchedData)(req);
        const status = body.status;
        await index_1.default.bets.findByIdAndUpdate(id, { $set: { status: status } });
        res.send({
            message: 'Bet Status Updated'
        });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot Update Bet Status');
    }
}
exports.updateBetStatus = updateBetStatus;
async function deleteBet(req, res) {
    try {
        const { id } = (0, express_validator_1.matchedData)(req);
        await index_1.default.bets.findOneAndDelete({ _id: id });
        res.send({ message: 'Bet deleted successfully' });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot delete bet');
    }
}
exports.deleteBet = deleteBet;
