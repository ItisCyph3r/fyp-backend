"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const videoSchema = new mongoose_1.default.Schema({
    video_title: {
        type: String,
        // type: { type: String },
        required: false
    },
    video_description: {
        type: String,
        // type: { type: String },
        required: false
    },
    course: {
        type: String,
        // type: { type: String },
        required: false
    },
    fileName: [{
            type: String,
            // type: { type: String },
            required: false
        }],
    thumbnail: {
        type: String,
        // type: { type: String },
        required: false
    },
    uuid: {
        // type: { type: String },
        type: String,
        // default: mongoose.Types.ObjectId,
        required: false
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    // date: {
    //     type: { type: Date },
    //     default: Date.now,
    //     required: false
    // }
}, {
    timestamps: true
});
exports.Video = mongoose_1.default.model('Video', videoSchema);
