import { google, Auth } from 'googleapis';
import * as fs from 'fs';
import path from 'path';

class DriveVideoManager {
  private auth: Auth.GoogleAuth;
  private drive: any;

  constructor() {
    // this.initDrive();
    const credentialPaths = path.join(
      __dirname,
      '../static/videobox-credentials.json'
    );
    const credentials = this.loadCredentials(credentialPaths);
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/docs',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
      ]
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
        throw new Error(
          `No se encontró la carpeta con el nombre: ${folderName}`
        );
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
      throw new Error(
        'Error al obtener los enlaces de descarga: ' + error.message
      );
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

  async createFolder(
    folderName: string,
    parentFolderId = '1zONUZ6CBZIWiv8TUF0hKDkIBhOC9DGSb'
  ) {
    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId]
      };
      const folder = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      });
      return folder.data.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async deleteFolder(folderName: string): Promise<void> {
    try {
      const folder = await this.findFolderByName(folderName);
      if (!folder) {
        throw new Error(
          `No se encontró la carpeta con el nombre: ${folderName}`
        );
      }

      await this.drive.files.delete({ fileId: folder.id });
      await this.createFolder('Test Media Player Back');
    } catch (error: any) {
      throw new Error(
        'Error al eliminar los archivos de la carpeta: ' + error.message
      );
    }
  }
}

export default DriveVideoManager;
