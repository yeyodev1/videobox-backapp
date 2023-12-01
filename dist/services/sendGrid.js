"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
async function sendEmail(email, subject, body) {
    const messageData = {
        to: email,
        from: 'lreyes@nabux.ec',
        subject: subject,
        html: body
    };
    try {
        await mail_1.default.send(messageData);
    }
    catch (error) {
        console.log(error);
    }
}
exports.sendEmail = sendEmail;
