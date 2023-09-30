"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = exports.tokenSign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
async function tokenSign(user) {
    const expiresIn = user.role[0] === 'user' ? '365d' : '7d';
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }
    const sign = await jsonwebtoken_1.default.sign({
        _id: user._id,
        role: user.role[0]
    }, JWT_SECRET, {
        expiresIn: expiresIn
    });
    return sign;
}
exports.tokenSign = tokenSign;
function getUserIdFromToken(token) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decodedToken._id;
    }
    catch (error) {
        return null;
    }
}
exports.getUserIdFromToken = getUserIdFromToken;
