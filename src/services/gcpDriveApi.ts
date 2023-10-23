import { google, Auth } from 'googleapis';
import * as fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const readFileAsync = promisify(fs.readFile);

class DriveVideoManager {
  private auth: Auth.GoogleAuth;
  private drive: any;

  constructor() {
    const credentialPaths = path.join(
      __dirname,
      '../static/videobox-401504-b63bc5c2cea5.json'
    );
    const credentials = this.loadCredentials(credentialPaths);
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive']
    });
    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  private loadCredentials(credentialPaths: string) {
    try {
      const content = fs.readFileSync(credentialPaths, 'utf8');
      return JSON.parse(content);
    } catch (error: any) {
      throw new Error('Error al cargar las credenciales: ' + error.message);
    }
  }

  async getAccessToken() {
    const authClient = await this.auth.getClient();
    return await authClient.getAccessToken();
  }

  async getDirectVideoLinksInFolder(folderName: string) {
    try {
      const folder = await this.findFolderByName(folderName);
      if (!folder) {
        throw new Error(`No se encontró la carpeta con el nombre: ${folderName}`);
      }
      const videos = await this.drive.files.list({
        q: `'${folder.id}' in parents and mimeType contains 'video/'`,
        fields: 'files(name,webViewLink,webContentLink,originalFilename, id)'
      });
      const directLinks = videos.data.files.map((video: any) => ({
        name: video.name,
        directLink: video.id,
        originalFilename: video.originalFilename,
        webViewLink: video.webViewLink,
        contectLink: video.webContentLink
      }));
      return directLinks;
    } catch (error: any) {
      throw new Error('Error al obtener los enlaces de descarga: ' + error.message);
    }
  }

  private async findFolderByName(folderName: string) {
    try {
      const folders = await this.drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
        fields: 'files(id)'
      });
      if (folders.data.files.length > 0) {
        return folders.data.files[0];
      }
      return null;
    } catch (error: any) {
      throw new Error('Error al buscar la carpeta: ' + error.message);
    }
  }

  async deleteAllFilesInFolder(folderName: string): Promise<void> {
    try {
      const folder = await this.findFolderByName(folderName);
      if (!folder) {
        throw new Error(
          `No se encontró la carpeta con el nombre: ${folderName}`
        );
      }
      // Obtiene una lista de todos los archivos en la carpeta
      const files = await this.drive.files.list({
        q: `'${folder.id}' in parents`,
        fields: 'files(id)'
      });
      // Borra cada archivo en la carpeta
      for (const file of files.data.files || []) {
        await this.drive.files.delete({ fileId: file.id });
      }
      console.log(
        `Todos los archivos en la carpeta "${folderName}" han sido eliminados.`
      );
    } catch (error: any) {
      throw new Error(
        'Error al eliminar los archivos de la carpeta: ' + error.message
      );
    }
  }
}

export default DriveVideoManager;
