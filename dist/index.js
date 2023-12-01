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
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const syncDriveAndGcp_1 = __importDefault(require("./tasks/syncDriveAndGcp"));
const mongo_1 = __importDefault(require("./config/mongo"));
const routes_1 = __importDefault(require("./routes"));
async function main() {
    await (0, mongo_1.default)();
    dotenv.config();
    const whiteList = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://videobox.pe',
        'https://radiant-narwhal-d48ded.netlify.app',
        'https://exquisite-haupia-c6a708.netlify.app',
        // TODO: add app sandbox domain
    ];
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: whiteList }));
    app.use(express_1.default.json());
    const port = process.env.PORT || 3000; // Fallback port value, change it to your preferred port
    (0, routes_1.default)(app);
    app.get('/', (_req, res) => {
        res.send('Videobox is aliveeee! (╯°□°）╯');
    });
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    node_cron_1.default.schedule('*/58 * * * *', async () => {
        // Coloca aquí el código que deseas ejecutar en el cron job
        await (0, syncDriveAndGcp_1.default)(); // Llama a la función correspondiente
        console.log('Sincronización con drive y drive');
    });
}
main();
