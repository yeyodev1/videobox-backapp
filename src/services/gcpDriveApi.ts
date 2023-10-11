import { google, Auth } from 'googleapis';
import * as fs from 'fs';

class DriveVideoManager {
  private auth: Auth.GoogleAuth;
  private drive: any;

  constructor() {
    // Carga las credenciales desde el archivo JSON en la raíz del proyecto
    const credentials = this.loadCredentials();

    // Configura la autenticación
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    // Crea una instancia de la API de Google Drive
    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  private loadCredentials() {
    try {
      // Carga las credenciales desde el archivo JSON en la raíz del proyecto
      const content = fs.readFileSync(
        'videobox-401504-b63bc5c2cea5.json',
        'utf8'
      );
      return JSON.parse(content);
    } catch (error: any) {
      throw new Error('Error al cargar las credenciales: ' + error.message);
    }
  }

  async getVideosInFolder(folderName: string) {
    try {
      // Busca la carpeta por nombre
      const folder = await this.findFolderByName(folderName);

      if (!folder) {
        throw new Error(
          `No se encontró la carpeta con el nombre: ${folderName}`
        );
      }

      // Obtiene los archivos de tipo video en la carpeta
      const videos = await this.drive.files.list({
        q: `'${folder.id}' in parents and mimeType contains 'video/'`,
        fields: 'files(name,webViewLink)'
      });

      // Formatea los resultados y los devuelve como un array de objetos
      return videos.data.files.map((video: any) => ({
        name: video.name,
        webViewLink: video.webViewLink
      }));
    } catch (error: any) {
      throw new Error('Error al obtener los videos: ' + error.message);
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
}

export default DriveVideoManager;
