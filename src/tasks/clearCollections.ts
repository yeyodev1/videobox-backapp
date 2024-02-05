import models from '../models';

export async function clearCollections() {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    await models.videoTask.deleteMany({});
    await models.padelVideos.deleteMany({ createdAt: { $lt: monthAgo } });
  } catch (error) {
    console.error('Error cleaning collections: ', error);
  }
}
