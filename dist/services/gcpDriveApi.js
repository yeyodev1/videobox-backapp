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
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const readFileAsync = (0, util_1.promisify)(fs.readFile);
class DriveVideoManager {
    constructor() {
        const credentialPaths = path_1.default.join(__dirname, '../static/videobox-bucket.json');
        const credentials = this.loadCredentials(credentialPaths);
        this.auth = new googleapis_1.google.auth.GoogleAuth({
            credentials,
            scopes: [
                'https://www.googleapis.com/auth/docs',
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.appdata',
                'https://www.googleapis.com/auth/drive.metadata',
                'https://www.googleapis.com/auth/drive.scripts'
            ]
        });
        this.drive = googleapis_1.google.drive({ version: 'v3', auth: this.auth });
    }
    loadCredentials(credentialPaths) {
        try {
            const content = fs.readFileSync(credentialPaths, 'utf8');
            return JSON.parse(content);
        }
        catch (error) {
            throw new Error('Error al cargar las credenciales: ' + error.message);
        }
    }
    async getAccessToken() {
        const authClient = await this.auth.getClient();
        return await authClient.getAccessToken();
    }
    async getDirectVideoLinksInFolder(folderName) {
        try {
            const folder = await this.findFolderByName(folderName);
            if (!folder) {
                throw new Error(`No se encontró la carpeta con el nombre: ${folderName}`);
            }
            const videos = await this.drive.files.list({
                q: `'${folder.id}' in parents and mimeType contains 'video/'`,
                fields: 'files(name,webViewLink,webContentLink,originalFilename, id)'
            });
            const directLinks = videos.data.files.map((video) => ({
                name: video.name,
                directLink: video.id,
                originalFilename: video.originalFilename,
                webViewLink: video.webViewLink,
                contectLink: video.webContentLink
            }));
            return directLinks;
        }
        catch (error) {
            throw new Error('Error al obtener los enlaces de descarga: ' + error.message);
        }
    }
    async findFolderByName(folderName) {
        try {
            const folders = await this.drive.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
                fields: 'files(id)'
            });
            if (folders.data.files.length > 0) {
                return folders.data.files[0];
            }
            return null;
        }
        catch (error) {
            throw new Error('Error al buscar la carpeta: ' + error.message);
        }
    }
    async deleteAllFilesInFolder(folderName) {
        try {
            const folder = await this.findFolderByName(folderName);
            if (!folder) {
                throw new Error(`No se encontró la carpeta con el nombre: ${folderName}`);
            }
            // Obtiene una lista de todos los archivos en la carpeta
            const files = await this.drive.files.list({
                q: `'${folder.id}' in parents`,
                fields: 'files(id)'
            });
            // Borra cada archivo en la carpeta
            for (const file of files.data.files || []) {
                await this.drive.files.delete({
                    fileId: file.id
                });
            }
            console.log(`Todos los archivos en la carpeta "${folderName}" han sido eliminados.`);
        }
        catch (error) {
            throw new Error('Error al eliminar los archivos de la carpeta: ' + error.message);
        }
    }
}
exports.default = DriveVideoManager;
