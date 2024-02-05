const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');  // to generate random passwords
require("dotenv").config();

const User = require('../models/user');


const opts = {
    clientID: process.env.PASSPORT_GOOGLE_AUTH2_CLIENT_ID || "817139613167-3plqr8mfeoo6bjlq1mka6ksk6jq18tjs.apps.googleusercontent.com",
    clientSecret: process.env.PASSPORT_GOOGLE_AUTH2_SECRET_KEY || "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
}

//tell paasport to use googleStrategy for google login
passport.use(new googleStrategy(opts, async function (accessToken, refreshToken, profile, done){
        try {
            //profile consists of user datas
            // console.log(profile);

            //find user and return it to passport
            const user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                //if found, set this user as req.user(passport will do this, we just need to return user to passport)
                return done(null, user);
            }
            else {
                //if not found, create the user and set it as req.user
                const createdUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });

                return done(null, user);
            }

            //note:- done takes two argument first as err and second as data
        } catch (error) {
            console.log('Error in google strategy-passport', error);
            return;
        }
    }
));

module.exports= passport;