import mongoose, { Document, Schema } from 'mongoose';
import type { Club } from '../types/ClubType';

export interface Sports extends Document {
  name: string;
  image: string;
  fieldsDetails?: Club[]; // Agrega una propiedad para almacenar las canchas relacionadas
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
        from: 'club',
        localField: '_id',
        foreignField: 'sport',
        as: 'fieldsDetails'
      }
    }
  ]);
};

// Agrega un método personalizado para buscar un solo deporte con sus canchas relacionadas
sportsSchema.statics.findOneWithSports = function (sportId: string) {
  return this.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(sportId) } // Convierte el ID en un ObjectId
    },
    {
      $lookup: {
        from: 'clubs',
        localField: '_id',
        foreignField: 'sport',
        as: 'fieldsDetails'
      }
    }
  ]);
};

export default mongoose.model<Sports, SportsModel>('sports', sportsSchema);
