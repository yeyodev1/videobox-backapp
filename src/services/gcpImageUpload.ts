import { Response } from 'express';
import { Storage } from '@google-cloud/storage';
import { format } from 'url';
import * as dotenv from 'dotenv';

dotenv.config();

const storage = new Storage({
  projectId: process.env.BUCKET_PROJECT_ID,
  credentials: {
    client_email: process.env.BUCKET_CLIENT_EMAIL,
    private_key: process.env.BUCKET_PRIVATE_KEY?.split(String.raw`\n`).join(
      '\n'
    )
  }
});

const bucketName = 'videbox-bucket';
const bucket = storage.bucket(bucketName);

async function gcpImageUpload(file: any, location?: string): Promise<string> {
  try {
    const ext = file.originalname.split('.').pop();
    const string = file.originalname.split('.').shift();
    const name = string?.replace(/\s/g, '_').replace(' ', '.');
    console.log(string);
    const filename = `file-${Date.now()}-${name}.${ext}`;

    console.log(filename);
    const blob = bucket.file(location + filename);
    const blobStream = blob.createWriteStream({
      resumable: false
    });

    const publicUrl: string = await new Promise((resolve, reject) => {
      blobStream
        .on('error', (error: Response) => {
          console.log(error);
          reject('Error happened on image upload');
        })
        .on('finish', () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${filename}`
          );
          resolve(publicUrl);
        })
        .end(file.buffer);
    });

    return publicUrl;
  } catch (error) {
    console.log(error);
    return 'Cannot upload video';
  }
}

export default gcpImageUpload;
