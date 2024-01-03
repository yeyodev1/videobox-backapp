import axios from 'axios';

import DriveVideoManager from '../services/gcpDriveApi';
import { gcpVideoUpload } from '../services/gcpVideoUpload';
import models from '../models/index';

async function syncDriveToGcp(): Promise<void> {
  try {
    const driveManager = new DriveVideoManager();
    const folderId = 'Test Media Player';
    const gcsBucketFoler = 'video';
    const videoLinks = await driveManager.getDirectVideoLinksInFolder(folderId);
    const accessToken = await driveManager.getAccessToken();

    if (!videoLinks.length) {
      return;
    }

    for (const videoLink of videoLinks) {
      const fileInfo = await axios.get (`https://www.googleapis.com/drive/v3/files/${videoLink.directLink}`, {
        params: { fields: 'size' },
        headers: { Authorization: `Bearer ${accessToken.token}`}
      });
      
      const fileSize = fileInfo.data.size;
      const fileSizeMb = fileSize / (1024 * 1024);

      if (fileSizeMb > 5) {
        const videoDownloadLink = `https://www.googleapis.com/drive/v3/files/${videoLink.directLink}?alt=media`;
        const videoName = videoLink.name;
        const gcsLocation = gcsBucketFoler + videoName;

        const response = await axios.get(videoDownloadLink, {
          headers: { Authorization: `Bearer ${accessToken.token}`},
          responseType: 'stream'
        })

        // const publicUrl = await gcpVideoUpload(response.data, gcsLocation)

        const fileData = {
          name: videoName,
          // url: publicUrl,
          fileId: videoLink.directLink
        };

        await models.padelVideos.create(fileData);
      }
    }
    await driveManager.deleteFolder('Test Media Player');
  } catch (error) {
    console.log(error);
  }
}

export default syncDriveToGcp;
