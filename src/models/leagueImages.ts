import mongoose, { Schema } from 'mongoose';

const leagueImagesSchema: Schema = new mongoose.Schema(
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

export default mongoose.model('leagueImages', leagueImagesSchema);
