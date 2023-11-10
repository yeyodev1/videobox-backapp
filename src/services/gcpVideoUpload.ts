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
    private_key: process.env.BUCKET_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }

  // projectId: 'videobox-401504',
  // credentials: {
  //   client_email: 'videobox-117@videobox-401504.iam.gserviceaccount.com',
  //   private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+hGP4w563LlaP\nmUQ/U8pqkEoQNXpXMAKIXMRqUXwFRNp0SU3n1XhBXe4qMZos5KoVO5G8ALuWTPJQ\n0EDfT3tAsd/VjfyalMlWfICKF8NxlpZ6KmtugPJn8y1XVl0iT4Rl4z7DbQSIGEjz\nhcN0IQeQHrYMRHPKJ18W/wXORNoGIqNsDaJ8aOjL6TWa09ShAETa7/aKmQPL7SPB\nnOfXZv65uHuwk8NrwCFEO6ly2zuujCpmVRWh7YXUHo3tll6jTzEkx/TmGHZ8OBYV\nASUUxa2lFJQR9BLY8QX9VnXhL2YwLNIoeipm2S9DKwHFDQURh0btnTVCHfq8SKYs\nG83ULyxTAgMBAAECggEAR3mNtAdX5StaSDdc9lEuMHp/fsNBabJWUOhUu/pkB+oD\n9vqFYsOggQ2HS4cea1dCRAL8MscnmUS26ACpRd4gxG23JvxE142YV30QED7IETZI\nr/54HZX822jNCuYYvMWOS1dM9a5Rs+lAfTQi1s+JcdVDwShxNFc/Anacq/0Cuqff\n0LIF9qDn77S6vA2o6w0yu89SFG4Vexbq3+5ka+o2j2fwU6nw2BPYMND1ZJyJ9vTG\nytJUehJ8u3MdNKKnD3ZG7WF69C3xzE1CLCfY4cC60yyrznUIKF7EI7VJs6VmJYYs\nGcikDYiGAlZhv3XhnGiqTmAPunQUxbdl4KOVhEC3AQKBgQDwVc48aircuM74THK2\nK18hGCii/YSuc7LOmbByVJYvcnQ5CDLQnmRvAP93aYMUDuAUoAnAJx5z9Sa6DlgN\nQotfsasLA1iTae2sqsizW5jSZVtounKtj+nVuGxpx08LoUG0DJa7whD99gQlX73s\n8LVcnHNYTSIfQtqEXD7Z+b3egQKBgQDK71RJ67rO8HnD2jVg4XR5c5rrmafKBRAi\nFi3HwJK1IJyxPMSQszeFsT8xIpgcF6xbv1kjGizno/mp6g11HwfIn7QNAkyLA7lD\ncsy99tbTkNviFOQgVTCqKFmDkbJbDGaOTHvi8aiDfBsa2T13Snm9Ljo4I9RUvBNf\n9foFcNzI0wKBgAHzcF0lL3vjNCrn0/aOm5MVMx8/l5gi8EylCr2i2iVAdJkR6/et\nkXslMu2xOZMsG72PHwUkTCb80neoLibNZ3w7YPwR5uIrdfZ03HQ4RiFPGVLcUJoA\nFRHbEWY6a/XYNURU5dRYWvL00EvNXylROuepjXYmCiTe0g9JAGmckWIBAoGBALsm\n7P0fQTEH5cQRwZiPU/OOAhm1o2BUOwS0n5PQrXwNj3SFLmKkZVgOltChrtZ5nqMe\nXP5abX9TYjSpfa+95lfHsS0uKZkq3fiuLtQiiQykU6S0z45iAndqruL/wxTk4s/p\nCXfKljZshjLElkMllBA8ScTshi1/Jf8hwmqyI2uxAoGANArtQpZSpS55Zlu1vAu8\n23njI1KVpSPjfEJzxwGBNTWSL3Z9+G1rqZMrUHpbNNar4r/nPLDqSXbYoDZpCrSE\ndNNNdidUfsbndqGyhBZPgB2hm1uPESlG6Ax8Tr1BODmV7GbN4z8qm6Cdc/uraQYv\naKAwl2XJLQN9JB1SkfYrjko=\n-----END PRIVATE KEY-----\n'  }
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
    console.log(filename);

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

export {gcpVideoUpload, uploadVideoToGCS};
