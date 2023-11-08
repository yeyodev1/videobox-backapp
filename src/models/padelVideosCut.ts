import mongoose from 'mongoose';

const padelVideoSchema = new mongoose.Schema({
  name: String,
  url: String,
  size: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Video = mongoose.model('videoCut', padelVideoSchema);

export default Video;
