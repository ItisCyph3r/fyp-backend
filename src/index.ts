import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { User } from './user';
import { Video } from './video';
import { IMongoDBUser } from './types';
const GoogleStrategy = require('passport-google-oauth20');
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
dotenv.config();
const host = '0.0.0.0'
const app: Express = express();
const port = process.env.PORT;



// const sequelize = require('./util/db')

// import { User } from './models/user';

// const User = require('./models/user');

// import { Video } from './models/course';

// const Video = require('./models/video');

// import {User, Video} from './models/association'
// const { User, Video } = require('./models/association')

// import { User } from './models/association';

// User.hasMany(Video, { foreignKey: 'userId' });
// export const VideoM = Video.belongsTo(User, { foreignKey: 'userId' });

// const UserModel: typeof User = User;


// sequelize
//     .sync()
//     .then((data: any) => {
//         // console.log(data)
//     })
//     .catch((error: Error) => {
//         console.log(error)
//     })
//     .finally(() => {
//         console.log('complete')
//     })

// db config
try {
    mongoose.connect(process.env.USER_SECRET, () => { console.log('Connected to Mongoose successfull') })
} catch (error: any) {
    throw error
}



// middleware
app.set("trust proxy", 1);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
        // cookie: {
        //     sameSite: "none",
        //     secure: true,
        //     maxAge: 1000 * 60 * 60 * 24
        // }
    })
);
app.use(passport.initialize());
app.use(passport.session());


// passport.serializeUser((user: IMongoDBUser, done: any) => {
//     return done(null, user._id);
// });

// passport.deserializeUser(async (id: string, done: any) => {
//     try {
//         const user = await UserModel.findByPk(id as any, { raw: true });
//         return done(null, user);
//     } catch (error) {
//         return done(error, null);
//     }
// });


passport.serializeUser((user: IMongoDBUser, done: any) => {
    return done(null, user._id);
})

passport.deserializeUser((id: string, done: any) => {
    User.findById(id, (error: Error, doc: IMongoDBUser) => {
        return done(null, doc);
    })

})

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback",
// },
//     async (_: any, __: any, profile: any, cb: any) => {
//         try {
//             const user = await User.findOne({
//                 where: {
//                     googleId: profile.id
//                 }
//             },);

//             if (user) {
//                 return cb(null, user);
//             } else {
//                 const formattedName = profile.displayName.split(" ").join("_");

//                 const newUser = await User.create({
//                     displayName: `${formattedName}${Math.floor(1000 + Math.random() * 9000)}`,
//                     userName: formattedName,
//                     googleId: profile.id,
//                     displayPicture: profile.photos[0].value,
//                     isVerified: false
//                 });

//                 return cb(null, newUser);
//             }
//         } catch (error) {
//             return cb(error);
//         }
//     }
// ));


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
},
    function (_: any, __: any, profile: any, cb: any) {

        User.findOne({ googleId: profile.id }, async function (err: Error, doc: IMongoDBUser) {

            if (!err) {
                if (doc) {
                    return cb(err, doc)
                } else {
                    const formattedName = profile.displayName.split(' ').join('_')
                    console.log(formattedName)
                    User.create({
                        displayName: formattedName + Math.floor(1000 + Math.random() * 9000),
                        userName: formattedName,
                        googleId: profile.id,
                        displayPicture: profile.photos[0].value,
                        isVerified: false
                    }, (err: Error, user: any) => {
                        return cb(err, user)
                    })
                }
            }
        })
    }
));



passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
},
    function (_: any, __: any, profile: any, cb: any) {
        // asynchronous verification, for effect...
        console.log(profile)
        process.nextTick(function () {
            User.findOne({ googleId: profile.id }, async function (err: Error, doc: IMongoDBUser) {

                if (!err) {
                    if (doc) {
                        return cb(err, doc)
                    } else {
                        const formattedName = profile.displayName.split(' ').join('_')
                        console.log(formattedName)
                        User.create({
                            displayName: formattedName + Math.floor(1000 + Math.random() * 9000),
                            userName: formattedName,
                            linkedinId: profile.id,
                            displayPicture: profile.photos[0].value,
                            isVerified: false
                        }, (err: Error, user: any) => {
                            return cb(err, user)
                        })
                    }
                }
            })
        });
    }));

app
    .route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['profile']
    }));

app.get('/auth/google/callback',
    // passport.authenticate('google', { failureRedirect: '/login',
    passport.authenticate('google', {
        failureMessage: true
    }),
    function (req, res) {
        // res.redirect('https://zap-twitter-clone.netlify.app/home');
        res.redirect('http://localhost:3000/home');

    });

app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE' }),
    function (req, res) {
        // The request will be redirected to LinkedIn for authentication, so this
        // function will not be called.
    });

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: 'http://localhost:3000/home',
    failureRedirect: 'http://localhost:3000/account'
}));

app
    .route('/getuser')
    .get((req, res) => {
        // console.log(req.user)
        res.send(req.user);
    })



app
    .route('/')
    .get((req, res) => {
        res.json('yeaaaah boooy')
    })
// let feedArray: any = [];
app
    .route('/api')
    .get(async (req, res) => {

        // Feed.find({}, (err: Error, doc: any) => {
        //     if (err) return err;
        //     else {
        //         // console.log(doc.reverse())
        //         res.json(doc)
        //     }
        // })
    })

    .post(async (req, res) => {


    })

app
    .route('/upload')
    .get((req, res) => {
        console.log(req.body)
    })
    .post((req, res) => {
        // console.log(req.body)

        // Video.create(req.body, (err: Error, doc: any) => {
        //     if (err) return err
        //     else console.log('Video Added')
        // })
        Video.create({
            video_title: req.body.video_title,
            video_description: req.body.video_description,
            course: req.body.course,
            fileName: [req.body.fileName],
            thumbnail: req.body.thumbnail,
            userId: req.body.userId,
            uuid: req.body.uuid,
            date: req.body.date
        },
            (err: any, doc: any) => {
                if (err) return err
                else { console.log("Video Added") }
            })
    })
app
    .route('/auth/logout')
    .get((req, res) => {
        if (req.user) {
            req.logout((error) => {
                if (error) return error
            });
            res.send("done")
        }
    })


app.listen(Number(process.env.YOUR_PORT) || process.env.PORT || port, host, () => {
    // console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    console.log('Server is Live!!!')
})
