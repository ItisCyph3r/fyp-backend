"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    user_name: {
        required: true,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    display_name: {
        required: false,
        type: String
    },
    google_id: {
        required: false,
        type: String
    },
    github_id: {
        required: false,
        type: String
    },
    linkedin_id: {
        required: false,
        type: String
    },
    display_picture: {
        required: false,
        type: String
    },
    isverified: {
        required: false,
        type: Boolean
    },
    // tweets: []
}, { timestamps: true });
exports.User = mongoose_1.default.model('user', userSchema);
