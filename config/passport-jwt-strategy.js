const passport=require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
require("dotenv").config();

const opts={
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.PASSPORT_JWT_SECRET_KEY || "anysecretkey0123"   //todo change before deploying project
}

passport.use(new JwtStrategy(opts, async function(jwt_payload, done){
    try {
        const user=await User.findById(jwt_payload._id);
        
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
            // or you could create a new account
        }
    } catch (error) {
        return done(err, false);
    }
}));

module.exports=passport;