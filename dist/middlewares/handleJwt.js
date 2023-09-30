"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.encrypt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function encrypt(passwordPlain) {
    const hash = await bcryptjs_1.default.hash(passwordPlain, 10);
    return hash;
}
exports.encrypt = encrypt;
async function compare(passwordPlain, hashPassword) {
    return await bcryptjs_1.default.compare(passwordPlain, hashPassword);
}
exports.compare = compare;
