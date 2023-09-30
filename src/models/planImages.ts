import mongoose, { Schema } from 'mongoose';

const planImagesSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    url: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('planImages', planImagesSchema);
