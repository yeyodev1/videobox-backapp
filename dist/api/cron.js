"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const syncDriveAndGcp_1 = __importDefault(require("../tasks/syncDriveAndGcp"));
exports.default = async (_req, res) => {
    try {
        await (0, syncDriveAndGcp_1.default)();
        console.log('Sincronización con drive y drive');
        res.status(200).send('Sincronización completada.');
    }
    catch (error) {
        console.error('Error en la sincronización:', error);
        res.status(500).send('Error en la sincronización.');
    }
};
