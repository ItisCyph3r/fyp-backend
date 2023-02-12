import mongoose from "mongoose";
import { User } from "./user";

const videoSchema = new mongoose.Schema({
    video_title: {
        // type: String,
        type: { type: String },
        required: false
    },
    video_description: {
        type: { type: String },
        required: false
    },
    course: {
        type: { type: String },
        required: false
    },
    fileName: [{
        type: { type: String },
        required: false
    }],
    thumbnail: {
        type: { type: String },
        required: false
    },
    uuid: {
        type: { type: String },
        // default: mongoose.Types.ObjectId,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
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


export const Video = mongoose.model('Video', videoSchema);

