import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    user_name: {
        required: true,
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
}, { timestamps: true })

export const User = mongoose.model('user', userSchema);
// export const UserT = typeof(User)

export interface UserT {
    user_name?: string;
    display_picture?: string;
    // Add other properties as needed
}

