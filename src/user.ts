import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
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
}, { timestamps: true })

export const User = mongoose.model('user', userSchema);

