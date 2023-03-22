import mongoose, { Types } from "mongoose";
import { User } from "./user";


import { Document } from 'mongoose';

export interface VideoDoc extends Document {
    video_title: string;
    video_description: string;
    course: string;
    fileName: string[];
    thumbnail: string;
    uuid: string;
    userId: mongoose.SchemaDefinitionProperty<string>
    createdAt: Date;
    updatedAt: Date;
    comments: Types.ObjectId[];
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
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true
});


export const Video = mongoose.model<VideoDoc>('Video', videoSchema);

