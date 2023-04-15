"use strict";
// import mongoose from "mongoose";
// import bcrypt from 'bcrypt';
// import { UserDocument } from "../types/types";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// const userSchema = new mongoose.Schema({
//     user_name: {
//         required: true,
//         type: String
//     },
//     email: {
//         required: false,
//         type: String
//     },
//     password: {
//         required: false,
//         type: String
//     },
//     display_name: {
//         required: false,
//         type: String
//     },
//     google_id: {
//         required: false,
//         type: String
//     },
//     github_id: {
//         required: false,
//         type: String
//     },
//     linkedin_id: {
//         required: false,
//         type: String
//     },
//     display_picture: {
//         required: false,
//         type: String
//     },
//     isverified: {
//         required: false,
//         type: Boolean
//     },
//     // tweets: []
// }, { timestamps: true })
// userSchema.methods.checkPassword = async function (password: string) {
//     const match = await bcrypt.compare(password, this.password);
//     return match;
// };
// export const User = mongoose.model<UserDocument>('user', userSchema);
// // export const UserT = typeof(User)
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    user_name: {
        required: true,
        type: String,
    },
    email: {
        required: false,
        type: String,
    },
    password: {
        required: false,
        type: String,
    },
    display_name: {
        required: false,
        type: String,
    },
    google_id: {
        required: false,
        type: String,
    },
    github_id: {
        required: false,
        type: String,
    },
    linkedin_id: {
        required: false,
        type: String,
    },
    display_picture: {
        required: false,
        type: String,
    },
    isverified: {
        required: false,
        type: Boolean,
    },
}, { timestamps: true });
// Add the checkPassword method to the userSchema
// userSchema.methods.checkPassword = async function (password: string) {
//   const match = await bcrypt.compare(password, this.password);
//   return match;
// };
// Define and export the User model
exports.User = mongoose_1.default.model('User', userSchema);
