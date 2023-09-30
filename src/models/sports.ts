import mongoose, { Document, Schema } from 'mongoose';
import type { League } from '../types/LeagueType';

export interface Sports extends Document {
  name: string;
  image: string;
  leaguesDetails?: League[]; // Agrega una propiedad para almacenar las ligas relacionadas
}

const sportsSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

interface SportsModel extends mongoose.Model<Sports> {
  findAllData(): [];
  findOneWithLeagues(sportId: string): [];
}

sportsSchema.statics.findAllData = function () {
  return this.aggregate([
    {
      $lookup: {
        from: 'leagues',
        localField: '_id',
        foreignField: 'sport',
        as: 'leaguesDetails'
      }
    }
  ]);
};

// Agrega un método personalizado para buscar un solo deporte con sus ligas relacionadas
sportsSchema.statics.findOneWithLeagues = function (sportId: string) {
  return this.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(sportId) } // Convierte el ID en un ObjectId
    },
    {
      $lookup: {
        from: 'leagues',
        localField: '_id',
        foreignField: 'sport',
        as: 'leaguesDetails'
      }
    }
  ]);
};

export default mongoose.model<Sports, SportsModel>('sports', sportsSchema);
