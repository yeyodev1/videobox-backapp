import mongoose, { Schema } from 'mongoose';
import { BetEnum } from '../enum/betEnum';

const betsSchema: Schema = new mongoose.Schema(
  {
    sport: {
      type: String
    },
    league: {
      type: String
    },
    teamA: {
      type: String
    },
    teamB: {
      type: String
    },
    date: {
      type: Date
    },
    profit: {
      type: Number
    },
    percentage: {
      type: Number
    },
    description: {
      type: String
    },
    isFree: {
      type: Boolean
    },
    status: {
      type: String,
      enum: Object.values(BetEnum),
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('bets', betsSchema);
