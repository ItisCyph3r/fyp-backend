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
const user_1 = require("./user");
const video_1 = require("./video");
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
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use((0, express_session_1.default)({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //     sameSite: "none",
    //     secure: true,
    //     maxAge: 1000 * 60 * 60 * 24
    // }
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
// passport.use(new LocalStrategy({ userName: 'email' },
//   function(email: any, password: any, done: any) {
//     User.findOne({ email: email }, function (err: Error, user: any) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false, { message: 'Incorrect email.' }); }
//       user.authenticate(password, function(err: any, isMatch: any) {
//         if (err) { return done(err); }
//         if (!isMatch) { return done(null, false, { message: 'Incorrect password.' }); }
//         return done(null, user);
//       });
//     });
//   }
// ));
passport_1.default.use(new LocalStrategy(function (username, password, done) {
    user_1.User.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (!user.verifyPassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, function (_, __, profile, cb) {
    // console.log(profile)
    user_1.User.findOne({ google_id: profile.id }, function (err, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!err) {
                if (doc) {
                    return cb(err, doc);
                }
                else {
                    const formattedName = profile.displayName.split(' ').join('_');
                    console.log(formattedName);
                    user_1.User.create({
                        display_name: formattedName + Math.floor(1000 + Math.random() * 9000),
                        user_name: formattedName,
                        google_id: profile.id,
                        // email: profile.emails[0].value,
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
    // console.log(profile)
    process.nextTick(function () {
        user_1.User.findOne({ googleId: profile.id }, function (err, doc) {
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
                            user_name: formattedName,
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
    scope: ['profile', 'email']
}));
app.get('/auth/google/callback', 
// passport.authenticate('google', { failureRedirect: '/login',
passport_1.default.authenticate('google', {
    failureMessage: true
}), function (req, res) {
    // res.redirect('https://zap-twitter-clone.netlify.app/home');
    res.redirect('http://localhost:3000/home');
});
app.get('/auth/linkedin', passport_1.default.authenticate('linkedin', { state: 'SOME STATE' }), function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
});
app.get('/auth/linkedin/callback', passport_1.default.authenticate('linkedin', {
    successRedirect: 'http://localhost:3000/home',
    failureRedirect: 'http://localhost:3000/account'
}));
app
    .route('/getuser')
    .get((req, res) => {
    // console.log(req.user)
    res.send(req.user);
});
app
    .route('/signup')
    .post(function (req, res, next) {
    const { username, password } = req.body;
    user_1.User.findOne({ username: username }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            return res.status(409).send({ message: 'Username already taken' });
        }
        const newUser = new user_1.User({ username, password });
        newUser.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.send({ message: 'User created successfully' });
        });
    });
});
app
    .route('/')
    .get((req, res) => {
    res.json('yeaaaah boooy');
});
// let feedArray: any = [];
app
    .route('/api')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    .route('/home/:postId')
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
                video_title: video_title,
                video_description: video_description
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
