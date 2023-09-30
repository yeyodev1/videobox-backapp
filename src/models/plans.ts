import mongoose, { Schema } from 'mongoose';

const plansSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },

    description: {
      type: String
    },

    price: {
      type: Number
    },

    image: {
      type: String
    },

    durationInWeeks: {
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('plans', plansSchema);
