"use strict";
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const user_1 = require("./models/user");
const video_1 = require("./models/video");
const comment_1 = require("./models/comment");
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
dotenv_1.default.config();
const host = '0.0.0.0';
const app = (0, express_1.default)();
const port = process.env.PORT;
// db config
try {
    mongoose_1.default.connect(process.env.USER_SECRET, () => { console.log('Connected to Mongoose successfull'); });
}
catch (error) {
    throw error;
}
// middleware
app.set("trust proxy", 1);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({ origin: `${process.env.BASE_URL}`, credentials: true }));
// app.use(morgan('dev'))
app.use((0, express_session_1.default)({
    secret: 'LDR has some of the best animations',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //         sameSite: "none",
    //         secure: true,
    //         maxAge: 1000 * 60 * 60 * 24
    //     }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser((user, done) => {
    return done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => {
    user_1.User.findById(id, (error, doc) => {
        return done(null, doc);
    });
});
//     passport.use(new LocalStrategy({
//         usernameField: 'user_name',
//         passwordField: 'password'
//     }, async (user_name: string, password: string, done: any) => {
//         try {
//             const user = await User.findOne({ user_name });
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username or password.' });
//             }
//             const isValidPassword = await User.checkPassword(password);
//             if (!isValidPassword) {
//                 return done(null, false, { message: 'Incorrect username or password.' });
//             }
//             return done(null, user);
//         } catch (error) {
//             return done(error);
//         }
// }));
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, function (_, __, profile, cb) {
    user_1.User.findOne({ google_id: profile.id }, function (err, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!err) {
                if (doc) {
                    return cb(err, doc);
                }
                else {
                    const formattedName = profile.displayName.split(' ').join('_');
                    user_1.User.create({
                        display_name: formattedName + Math.floor(1000 + Math.random() * 9000),
                        user_name: formattedName,
                        gofogle_id: profile.id,
                        email: profile.emails[0].value,
                        display_picture: profile.photos[0].value,
                        isverified: false
                    }, (err, user) => {
                        return cb(err, user);
                    });
                }
            }
        });
    });
}));
passport_1.default.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
}, function (_, __, profile, cb) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        user_1.User.findOne({ linkedin_id: profile.id }, function (err, doc) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!err) {
                    if (doc) {
                        return cb(err, doc);
                    }
                    else {
                        const formattedName = profile.displayName.split(' ').join('_');
                        // console.log(formattedName)
                        user_1.User.create({
                            display_name: formattedName + Math.floor(1000 + Math.random() * 9000),
                            user_name: profile.displayName,
                            email: profile.emails[0].value,
                            linkedin_id: profile.id,
                            display_picture: profile.photos[0].value,
                            isverified: false
                        }, (err, user) => {
                            return cb(err, user);
                        });
                    }
                }
            });
        });
    });
}));
app
    .route('/auth/google')
    .get(passport_1.default.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email']
}));
app.get('/auth/google/callback', 
// passport.authenticate('google', { failureRedirect: '/login',
passport_1.default.authenticate('google', {
    failureMessage: true
}), function (req, res) {
    res.redirect(`${process.env.BASE_URL}/watch`);
    // res.redirect('http://localhost:3000/home');
});
app.get('/auth/linkedin', passport_1.default.authenticate('linkedin', { state: 'SOME STATE' }), function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
});
app.get('/auth/linkedin/callback', passport_1.default.authenticate('linkedin', {
    // successRedirect: 'http://localhost:3000/home',
    successRedirect: `${process.env.BASE_URL}/watch`,
    // failureRedirect: 'http://localhost:3000/account'
    failureRedirect: `${process.env.BASE_URL}/account`,
}));
app
    .route('/getuser')
    .get((req, res) => {
    // console.log(req.user)
    res.send(req.user);
});
app
    .route('/api/checkEmail')
    .post((req, res) => {
    console.log(req.body);
    user_1.User.findOne({ email: req.body.username }, (err, user) => {
        if (err) {
            console.error(err);
        }
        else {
            if (user) {
                // Email exists, return 200 status code
                res.sendStatus(200);
            }
            else {
                // Email does not exist, return 404 status code
                res.sendStatus(404);
            }
        }
    });
});
app
    .route('/api/signup')
    .get((req, res) => {
    // console.log(req.user)
    console.log('fml');
})
    .post((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     const { username, email, password } = req.body;
    //     // console.log({username, email, password})
    //     const existingEmail = await User.findOne({ email: email });
    //     const existingUsername = await User.findOne({ display_name: username });
    //     // console.log(existingUsername)
    //     if (existingEmail) { return res.json({ message: 'Email already exists' }); }
    //     if (existingUsername) { return res.json({ message: 'User already exists' }); }
    //     const newUser = new User({
    //         email: email,
    //         user_name: username,
    //         password: password
    //     });
    //     newUser.save();
    //     return res.status(200).json({ message: 'User created successfully' });
    // // } catch (error) {
    // //     console.error(error);
    // //     return res.status(500).json({ message: 'Server error' });
    // }
    // catch (err) {
    //     console.log(err)
    // }
    try {
        const { username, email, password } = req.body;
        const existingEmail = yield user_1.User.findOne({ email: email });
        const existingUsername = yield user_1.User.findOne({ user_name: username });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const newUser = new user_1.User({
            email: email,
            user_name: username,
            password: password,
        });
        yield newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error;
    }
}));
app
    .route('/')
    .get((req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.session.passport.user);
    }
    else {
        res.json('invalid');
    }
});
// let feedArray: any = [];
app
    .route('/api/example')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Hello world');
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
app
    .route('/upload')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield video_1.Video.find();
        // Fetch user profile for each video
        const videoData = yield Promise.all(videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.User.findById(video.userId);
            return {
                video_id: video._id,
                video_title: video.video_title,
                video_description: video.video_description,
                course: video.course,
                fileName: video.fileName[0],
                thumbnail: video.thumbnail,
                uuid: video.uuid,
                user: user,
                createdAt: video.createdAt,
                // updatedAt: video.updatedAt
            };
        })));
        // console.log(videoData)
        res.json(videoData);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}))
    .post((req, res) => {
    const videoObject = {
        video_title: req.body.video_title,
        video_description: req.body.video_description,
        course: req.body.course,
        fileName: req.body.fileName,
        thumbnail: req.body.thumbnail,
        userId: req.body.userId,
        uuid: req.body.uuid,
        date: req.body.date
    };
    video_1.Video.create(videoObject, (err, doc) => {
        if (err) {
            console.log(err); // Log any errors that occur during the save operation
            return res.status(500).send('Error saving video');
        }
        else {
            console.log('Video Added:', doc); // Log the saved document for debugging purposes
            return res.send('Video saved successfully');
        }
    });
});
app
    .route('/api/watch/:postId')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlParams = req.params.postId;
    try {
        const videos = yield video_1.Video.findOne({ uuid: urlParams });
        if (videos) {
            const user = yield user_1.User.findById(videos.userId).lean();
            const { video_title, video_description, course, fileName, createdAt } = videos;
            const { _id, display_name, display_picture } = user;
            const feedObject = {
                course: course,
                createdAt: createdAt,
                display_picture: display_picture,
                file_name: fileName,
                user_id: _id,
                display_name: display_name,
                video_id: videos._id,
                video_title: video_title,
                video_description: video_description,
            };
            res.json(feedObject);
        }
        else {
            res.json(null);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
app
    .route('/api/comment')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const video = yield video_1.Video.findOne({ uuid: req.query.v });
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        console.log(video);
        const comments = yield Promise.all(video.comments.map((commentId) => __awaiter(void 0, void 0, void 0, function* () {
            const comment = yield comment_1.Comment.findById(commentId);
            const user = yield user_1.User.findById(comment.author);
            return {
                _id: comment._id,
                content: comment.content,
                display_name: user === null || user === void 0 ? void 0 : user.display_name,
                display_picture: user === null || user === void 0 ? void 0 : user.display_picture,
                createdAt: comment.createdAt,
            };
        })));
        res.json(comments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vid = yield video_1.Video.find({ uuid: req.query.v });
    const comment = new comment_1.Comment({
        content: req.body.content,
        author: req.body.author,
        parentId: req.body.parentId,
    });
    try {
        const savedComment = yield comment.save();
        vid.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedVideo = yield video_1.Video.findByIdAndUpdate(video._id, { $push: { comments: savedComment._id } }, { new: true }).populate('comments').exec(); // <-- added .exec() to execute the query
            if (updatedVideo) { // <-- check if the video document exists
                res.json(updatedVideo);
            }
            else {
                console.log(`Video with id ${video._id} does not exist`);
                res.sendStatus(404);
            }
        }));
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));
app
    .route('/api/delete')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.AWS_ACCESS_KEY_ID, ' + ', process.env.AWS_SECRET_ACCESS_KEY);
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    if (req.isAuthenticated()) {
        try {
            const videoId = req.query.v;
            const video = yield video_1.Video.findOne({ uuid: videoId });
            if (!video) {
                return res.status(404).json({ message: "Video not found" });
            }
            // Check if authenticated user is the same as the user who uploaded the video
            if (req.session.passport.user !== video.userId.toString()) {
                return res.status(403).json({ message: "Unauthorized to delete this video" });
            }
            else {
                // Delete video and thumbnail files from AWS S3
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Delete: {
                        Objects: [
                            { Key: `${video.userId}/video/${video.fileName[0]}` },
                            { Key: `${video.userId}/thumbnail/${video.thumbnail}` },
                        ],
                    },
                };
                yield s3.deleteObjects(params).promise();
                // Delete video record from database
                yield video_1.Video.deleteOne({ _id: video._id }, (err, result) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(result); // { n: 1, ok: 1 })
                    return res.json({ message: "Video deleted successfully" });
                });
            }
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.json({ message: "Unauthorized User" });
    }
}));
app
    .route('/auth/logout')
    .get((req, res) => {
    if (req.user) {
        req.logout((error) => {
            if (error)
                return error;
        });
        res.send(false);
    }
});
app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    // console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    console.log('Server is Live!!!');
});
app.route('/api');
