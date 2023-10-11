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
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
class DriveVideoManager {
    constructor() {
        // Carga las credenciales desde el archivo JSON en la raíz del proyecto
        const credentials = this.loadCredentials();
        // Configura la autenticación
        this.auth = new googleapis_1.google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        // Crea una instancia de la API de Google Drive
        this.drive = googleapis_1.google.drive({ version: 'v3', auth: this.auth });
    }
    loadCredentials() {
        try {
            // Carga las credenciales desde el archivo JSON en la raíz del proyecto
            const content = fs.readFileSync('videobox-401504-b63bc5c2cea5.json', 'utf8');
            return JSON.parse(content);
        }
        catch (error) {
            throw new Error('Error al cargar las credenciales: ' + error.message);
        }
    }
    async getVideosInFolder(folderName) {
        try {
            // Busca la carpeta por nombre
            const folder = await this.findFolderByName(folderName);
            if (!folder) {
                throw new Error(`No se encontró la carpeta con el nombre: ${folderName}`);
            }
            // Obtiene los archivos de tipo video en la carpeta
            const videos = await this.drive.files.list({
                q: `'${folder.id}' in parents and mimeType contains 'video/'`,
                fields: 'files(name,webViewLink)'
            });
            // Formatea los resultados y los devuelve como un array de objetos
            return videos.data.files.map((video) => ({
                name: video.name,
                webViewLink: video.webViewLink
            }));
        }
        catch (error) {
            throw new Error('Error al obtener los videos: ' + error.message);
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
}
exports.default = DriveVideoManager;
