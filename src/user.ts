import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
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
}, { timestamps: true })

export const User = mongoose.model('user', userSchema);

