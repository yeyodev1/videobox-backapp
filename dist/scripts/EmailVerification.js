"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerification = void 0;
const index_1 = __importDefault(require("../models/index"));
const handleJwt_1 = require("../utils/handleJwt");
const EmailVerification_1 = require("../emails/EmailVerification");
const sendGrid_1 = require("../services/sendGrid");
async function sendVerification() {
    try {
        const users = await index_1.default.users.find();
        for (let i = 0; i < users.length; i++) {
            const email = users[i].email;
            const id = users[i].id;
            const role = users[i].role;
            const token = await (0, handleJwt_1.tokenSign)({
                role: role,
                _id: id
            });
            const link = `https://predix.ec/email-verified/${token}`;
            const verificationBody = (0, EmailVerification_1.generateEmailVerificationTemplate)(link);
            (0, sendGrid_1.sendEmail)(email, 'EMAIL DE VERIFICACIÓN', verificationBody);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.sendVerification = sendVerification;
