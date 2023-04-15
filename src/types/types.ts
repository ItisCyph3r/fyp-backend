import mongoose from "mongoose";

export interface IUser{
    userName: string;
    displayName?: string;
    googleId?: string;
    githubId?: string;
    displayPicture?: string;
}

export interface IMongoDBUser{
    user_name: string;
    google_id?: string;
    github_id?: string;
    linkedin_id?: string;
    email?: string;
    display_picture?: string;
    __v: number;
    _id: string;
}

interface IComment {
    // _id: string;
    content: string;
    author: string;
    parentId: string;
}

export interface UserDocument extends mongoose.Document {
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

export interface UserModel extends mongoose.Model<UserDocument> {
    // Define any static methods here
  }
  