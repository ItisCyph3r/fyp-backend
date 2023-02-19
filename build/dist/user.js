"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        required: true,
        type: String
    },
    displayname: {
        required: false,
        type: String
    },
    googleid: {
        required: false,
        type: String
    },
    githubid: {
        required: false,
        type: String
    },
    linkedinid: {
        required: false,
        type: String
    },
    displaypicture: {
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
