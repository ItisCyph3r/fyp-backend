// import mongoose from "mongoose";
// import bcrypt from 'bcrypt';
// import { UserDocument } from "../types/types";

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





import mongoose, { Document } from 'mongoose';


export interface UserDocument extends Document {
  user_name: string;
  email?: string;
  password?: string;
  display_name?: string;
  google_id?: string;
  github_id?: string;
  linkedin_id?: string;
  display_picture?: string;
  isverified?: boolean;
  checkPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
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
export const User = mongoose.model<UserDocument>('User', userSchema);
// export default User;


export interface UserT {
    user_name?: string;
    display_picture?: string;
    // Add other properties as needed
}






