"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        default: null
    },
    lastname: {
        type: String,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
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
    subscriptionStatus: {
        type: Boolean,
        default: false
    },
    subscriptionExpirationDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('users', usersSchema);
