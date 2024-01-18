const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


const opts={
    usernameField: 'email'  // we will keep email as unique feild
}
passport.use(new LocalStrategy(opts, async function (email, password, done) {
        try {
            //find user and return it to passport
            const user = await User.findOne({ email: email });
            
            //either user with gven email not found or password is wrong
            if (!user || user.password != password) {
                // console.log("Invalid userName or password"); // todo: show this on page
                return done(null, false, { message: 'Incorrect username or password' });
            }
            return done(null, user,  { message: 'Wellcome' });
            //note:- done takes two argument first as err and second as data
        } catch (error) {
            console.log('Error', error);
        }
    }
));

//serialize user on the basis of user_id (i.e. setting encrypted user_id in cookies to login)
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//deserialize user on the basis of user_id (i.e. get user_id from cookie and decrypt to login)
passport.deserializeUser(async function (id, done) {
    try {
        //to login find if user is present in db with given user id
        const user = await User.findById(id);
        return done(null, user);
    } catch (error) {
        console.log('Error', error);
    }
});



//use below fn as middleware to check if user is logged in or not to give access to certain resources
passport.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();  // i.e give access
    }
    return res.redirect('/users/login');
}

//Below method will set user in local so that we can access current logedIn User's data
//this will be usefull to use user data in ejs files (eg: profile.ejs)
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();  // v.v.i as this fn will be use as middleware in index.js file
}

module.exports = passport;