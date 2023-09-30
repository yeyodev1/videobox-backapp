"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
function authenticateToken(req, res, next) {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    const token = tokenHeader.split(' ')[1]; // get token from header
    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET is not set' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.body.id = decodedToken._id; // Add id to request
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}
exports.authenticateToken = authenticateToken;
