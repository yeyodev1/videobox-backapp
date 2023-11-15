import mongoose from 'mongoose';
import monggose, { Schema } from 'mongoose';

const videoTaskChema: Schema = new monggose.Schema(
  {
    taskId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'error'],
      default: 'pending',
    },
    url: {
      type: String
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model('VideoTask', videoTaskChema)