const User = require('../models/user');
const Friendship= require('../models/friendship');
const fs=require('fs');


module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('signup', {
        layout: 'signup',   //as we dont want to apply ejs-layout to login and signup
        title: "Connectify | Signup"
    });
}

module.exports.login = async function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('login', {
        layout: 'login',
        title: "Connectify | Login",
    });
}

module.exports.profile = async function (req, res) {
    //get the user
    const profileUser = await User.findById(req.params.userId)
                                    .populate({
                                        path: 'posts',
                                        options: { sort: { createdAt: -1 } } // Sort posts by createdAt in descending order
                                    });
                                    
    const currentUser= req.user;
    
    //when rendering user's profile also send if there is friendship between currentLoggedIn user and profile User
    const existingFriendship = await Friendship.findOne({
        $or: [
            { from_user: currentUser._id, to_user: profileUser._id },
            { from_user: profileUser._id, to_user: currentUser._id }
        ]
    });

    return res.render('user_profile', {
        title: "Connectify | Profile",
        profile_user: profileUser,
        friendship: existingFriendship
    });
}

module.exports.profileUpdate = async function (req, res) {
    //get the user
    const user = await User.findById(req.user.id);

    return res.render('profile_edit', {
        title: "Connectify | Profile",
        profile_user: user
    });

}


//user update logic
module.exports.updateUser = async function (req, res) {
    try {
        let user = await User.findById(req.user.id);
        user.name = req.body.name;
        user.email = req.body.email;
        user.tagline = req.body.tagline;
        if (req.file) {
            //if user has alrready avatar then first delete it.
            if(user.avatar){
                fs.unlinkSync('./public/upload/'+user.avatar);
            }
            //below will save the image name which user has uploaded
            user.avatar = req.file.filename;
        }
        await user.save();
        req.flash('success', '✅ Prfile updated successfully!');
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}



module.exports.posts = function (req, res) {
    return res.end('User posts');
}


//logic for authentication start :-------------------->

//signup logic
module.exports.createUser = async function (req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            //todo:- show alert that password mismatch
            return res.redirect("back");
        }

        //check if given email is already exists in db
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            //todo:- show alert that email id alreadty exists
            console.log("user with given email already exists");
            // req.flash('error', "user with given email already exists!");  //not working
            return res.redirect("back");
        }
        else {
            //create the user in db
            await User.create(req.body);
            //todo:- show alert that registered success
            return res.redirect('/users/login');
        }
    } catch (error) {
        console.log('Error', error);
    }
}


//login logic and create session-> passport.authenticate middleware does all logic thing
module.exports.createSession = async function (req, res) {
    req.flash('success', 'Logged in successfully!');
    return res.redirect('/');
}



//logout and delete session 
module.exports.deleteSession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    })
}

//logic for authentication ends :-------------------->
