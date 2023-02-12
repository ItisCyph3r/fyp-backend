"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userName: {
        required: true,
        type: String
    },
    displayName: {
        required: false,
        type: String
    },
    googleId: {
        required: false,
        type: String
    },
    githubId: {
        required: false,
        type: String
    },
    linkedinId: {
        required: false,
        type: String
    },
    displayPicture: {
        required: false,
        type: String
    },
    isVerified: {
        required: false,
        type: Boolean
    },
    // tweets: []
}, { timestamps: true });
exports.User = mongoose_1.default.model('user', userSchema);
