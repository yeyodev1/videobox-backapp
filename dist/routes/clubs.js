"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleImage_1 = __importDefault(require("../middlewares/handleImage"));
const clubs_1 = require("../controllers/clubs");
const clubs_2 = require("../validators/clubs");
const router = express_1.default.Router();
router.get('/clubs', clubs_1.getClubs);
// TODO: endpoint to upload image to GCP before create Club on POST METHOD
router.post('/clubImage', handleImage_1.default.single('clubImage'), clubs_1.uploadClubImage);
router.post('/clubs', clubs_2.clubValidatorCreate, clubs_1.createClub);
router.put('/clubs/:id', clubs_2.clubValidatorUpdate, clubs_1.updateClub);
router.delete('/clubs/:id', clubs_2.clubValidatorDelete, clubs_1.deleteClub);
exports.default = router;
