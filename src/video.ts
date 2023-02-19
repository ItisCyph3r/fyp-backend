import mongoose from "mongoose";
import { User } from "./user";


import { Document } from 'mongoose';

interface VideoDoc extends Document {
    video_title: string;
    video_description: string;
    course: string;
    fileName: string[];
    thumbnail: string;
    uuid: string;
    userId: mongoose.SchemaDefinitionProperty<string>
    createdAt: Date;
    updatedAt: Date;
}

const videoSchema = new mongoose.Schema<VideoDoc>({
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


export const Video = mongoose.model<VideoDoc>('Video', videoSchema);

