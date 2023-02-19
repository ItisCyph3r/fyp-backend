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
const LocalStrategy = require('passport-local').Strategy;

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

passport.use(new LocalStrategy(
    function(username: any, password: any, done: any) {
      User.findOne({ username: username }, function (err:Error, user: any) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'

},
    function (_: any, __: any, profile: any, cb: any) {

        // console.log(profile)
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
                        // email: profile.emails[0].value,
                        displayPicture: profile.photos[0].value,
                        isVerified: false
                    }, (err: any, user: any) => {
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
                        }, (err: any, user: any) => {
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
        scope: ['profile', 'email']
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
    .route('/signup')
    .post(function(req, res, next) {
        const { username, password } = req.body;
        User.findOne({ username: username }, function (err: Error, user: any) {
            if (err) { return next(err); }
            if (user) { return res.status(409).send({ message: 'Username already taken' }); }

            const newUser = new User({ username, password });
                newUser.save(function (err) {
                    if (err) { return next(err); }
                return res.send({ message: 'User created successfully' });
            });
        });
    });



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
    .get(async(req, res) => {
        
        // Video.find({}, (err: Error, doc: any) => {
        //     if (err) return err
        //     else {
        //         console.log(doc)
        //         doc.forEach((element: any) => {
        //             // console.log(element.userId)
        //             User.findById(element.userId, (err: Error, user: any) => {
        //                 if (err) return err
        //                 else{
        //                     console.log(user)
        //                 }
        //             })
        //         });
                
        //         // res.json(doc)
        //     }
        // })

        try {
            const videos = await Video.find();
        
            // Fetch user profile for each video
            const videoData = await Promise.all(videos.map(async (video) => {
                const user = await User.findById(video.userId);
                return {
                video_title: video.video_title,
                video_description: video.video_description,
                course: video.course,
                fileName: video.fileName[0],
                thumbnail: video.thumbnail,
                uuid: video.uuid,
                // userId: video.userId,
                user: user, // include the user profile
                // createdAt: video.createdAt,
                // updatedAt: video.updatedAt
                };
            }));
        
            console.log(videoData)
            res.json(videoData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    })
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
        Video.create(videoObject, (err, doc) => {
            if (err) {
                console.log(err); // Log any errors that occur during the save operation
                return res.status(500).send('Error saving video');
            } else {
                console.log('Video Added:', doc); // Log the saved document for debugging purposes
                return res.send('Video saved successfully');
            }
        });
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
