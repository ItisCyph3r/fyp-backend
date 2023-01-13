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
const GoogleStrategy = require('passport-google-oauth20');
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
// let userFeed: any[] = [];
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
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, function (_, __, profile, cb) {
    user_1.User.findOne({ googleId: profile.id }, function (err, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!err) {
                if (doc) {
                    return cb(err, doc);
                }
                else {
                    const formattedName = profile.displayName.split(' ').join('_');
                    console.log(formattedName);
                    user_1.User.create({
                        displayName: formattedName + Math.floor(1000 + Math.random() * 9000),
                        userName: formattedName,
                        googleId: profile.id,
                        displayPicture: profile.photos[0].value,
                        isVerified: false
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
    console.log(profile);
    process.nextTick(function () {
        user_1.User.findOne({ googleId: profile.id }, function (err, doc) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!err) {
                    if (doc) {
                        return cb(err, doc);
                    }
                    else {
                        const formattedName = profile.displayName.split(' ').join('_');
                        console.log(formattedName);
                        user_1.User.create({
                            displayName: formattedName + Math.floor(1000 + Math.random() * 9000),
                            userName: formattedName,
                            linkedinId: profile.id,
                            displayPicture: profile.photos[0].value,
                            isVerified: false
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
    scope: ['profile']
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
    .route('/')
    .get((req, res) => {
    res.json('yeaaaah boooy');
});
// let feedArray: any = [];
app
    .route('/api')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Feed.find({}, (err: Error, doc: any) => {
    //     if (err) return err;
    //     else {
    //         // console.log(doc.reverse())
    //         res.json(doc)
    //     }
    // })
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.User.findOneAndUpdate({ _id: req.body.user }, { $push: { tweets: req.body } }, { $upsert: true, }, ((err, doc) => {
        if (err)
            return console.log(err);
        else {
            console.log('user tweets updated');
        }
    }));
    user_1.User.findById(req.body.user, (err, doc) => {
        if (err)
            return err;
        else {
            // Feed.create({
            //     user: req.body.user,
            //     userName: doc.userName,
            //     displayName: doc.displayName,
            //     displayPicture: doc.displayPicture,
            //     tweet: req.body.tweet,
            //     uuid: req.body.uuid,
            //     date: req.body.date
            // }, (err: any, doc: any) => {
            //     if (err) return err
            //     else { console.log("Feeeeeeed updated") }
            // })
        }
    });
}));
app
    .route('/delete_tweet')
    .get((req, res) => {
})
    .post((req, res) => {
    // console.log(req.body.tweet)
    // const tweet_id = req.body.tweet
    // Feed.findOneAndDelete({ _id: tweet_id }, (err: any, docs: any) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     else {
    //         console.log("Deleted User : ", docs);
    //     }
    // });
});
app
    .route('/auth/logout')
    .get((req, res) => {
    if (req.user) {
        req.logout((error) => {
            if (error)
                return error;
        });
        res.send("done");
    }
});
app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    // console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    console.log('Server is Live!!!');
});
