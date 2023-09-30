import mongoose, { Schema } from 'mongoose';

const sportImagesSchema: Schema = new mongoose.Schema(
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

export default mongoose.model('sportImages', sportImagesSchema);
