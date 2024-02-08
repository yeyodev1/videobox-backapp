import models from '../models';

export async function clearCollections() {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    await models.videoTask.deleteMany({});
  } catch (error) {
    console.error('Error cleaning collections: ', error);
  }
}
