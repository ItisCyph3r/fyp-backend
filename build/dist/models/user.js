"use strict";
// import mongoose from "mongoose";
// import bcrypt from 'bcrypt';
// import { UserDocument } from "../types/types";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const bcrypt_1 = __importDefault(require("bcrypt"));
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
userSchema.methods.checkPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = yield bcrypt_1.default.compare(password, this.password);
        return match;
    });
};
// Define and export the User model
exports.User = mongoose_1.default.model('User', userSchema);
