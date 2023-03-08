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