import mongoose, { Schema } from 'mongoose';

const usersSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },

    lastname: {
      type: String,
      default: null
    },

    userImage: {
      type: String,
      default: null
    },

    role: {
      type: ['user', 'admin'],
      default: 'admin'
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    phone: {
      type: String
    },

    birthdate: {
      type: Date,
      required: true
    },

    twitter: {
      type: String,
      default: null
    },

    instagram: {
      type: String,
      default: null
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    videos: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'padelVideos'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('users', usersSchema);
