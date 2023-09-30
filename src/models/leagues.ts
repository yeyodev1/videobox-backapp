import mongoose, { Schema } from 'mongoose';

const leaguesSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    image: {
      type: String
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sports'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('leagues', leaguesSchema);
