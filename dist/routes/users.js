"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const handleImage_1 = __importDefault(require("../middlewares/handleImage"));
const users_2 = require("../validators/users");
const HandleBearer_1 = require("../middlewares/HandleBearer");
const router = express_1.default.Router();
router.get('/users', users_1.getUsers);
// TODO: endpoint to upload image
// to GCP before create user on POST METHOD
router.post('/UserImage', handleImage_1.default.single('userImage'), users_1.uploadUserImage);
router.patch('/users/:id', users_2.userValidatorUpdate, users_1.updateUser);
router.get('/users/profile', HandleBearer_1.authenticateToken, users_1.getUser);
exports.default = router;
