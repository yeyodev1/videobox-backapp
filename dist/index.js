"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const mongo_1 = __importDefault(require("./config/mongo"));
const routes_1 = __importDefault(require("./routes"));
// import { sendVerification } from './scripts/EmailVerification';
async function main() {
    await (0, mongo_1.default)();
    dotenv.config();
    const whiteList = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://predix.ec'
        // TODO: add app sandbox domain
    ];
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: whiteList }));
    app.use(express_1.default.json());
    const port = process.env.PORT || 3000; // Fallback port value, change it to your preferred port
    (0, routes_1.default)(app);
    // sendVerification();
    app.get('/', (_req, res) => {
        res.send('Predix is online');
    });
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}
main();
