import { Storage } from '@google-cloud/storage';
import { format } from 'url';
import * as dotenv from 'dotenv';
import path from 'path';
import { createReadStream } from 'fs';

dotenv.config();

const storage = new Storage({
  projectId: process.env.BUCKET_PROJECT_ID,
  credentials: {
    client_email: process.env.BUCKET_CLIENT_EMAIL,
    private_key: process.env.BUCKET_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }
});

const bucketName = 'videbox-bucket';
const bucket = storage.bucket(bucketName);

async function gcpVideoUpload(
  stream: NodeJS.ReadableStream,
  filename: string
): Promise<string> {
  try {
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: false
    });

    const publicUrl: string = await new Promise((resolve, reject) => {
      blobStream
        .on('error', (error) => {
          reject('Error happened on video upload: ' + error.message);
        })
        .on('finish', () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${filename}`
          );
          resolve(publicUrl);
        });
      stream.pipe(blobStream);
    });

    return publicUrl;
  } catch (error) {
    console.error('Cannot upload video: ', error);
    throw error;
  }
}

async function uploadVideoToGCS(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filename = path.basename(filePath);
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: true,
      metadata: {
        contentType: 'video/mp4',
      },
    });

    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      resolve(publicUrl)
    });
    createReadStream(filePath).pipe(blobStream);
  });
    

}

export { gcpVideoUpload, uploadVideoToGCS };
