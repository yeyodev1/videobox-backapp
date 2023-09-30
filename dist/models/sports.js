"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sportsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});
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
sportsSchema.statics.findOneWithLeagues = function (sportId) {
    return this.aggregate([
        {
            $match: { _id: new mongoose_1.default.Types.ObjectId(sportId) } // Convierte el ID en un ObjectId
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
exports.default = mongoose_1.default.model('sports', sportsSchema);
