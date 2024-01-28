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
                                    })
                                    .populate({
                                        path: 'friendships',
                                        options: { sort: { createdAt: -1 } }
                                    });
                                    
    //check if friendships exists between profile user and current user?                                
    const currentUser= req.user;
    //when rendering user's profile also send if there is friendship between currentLoggedIn user and profile User
    const existingFriendship = await Friendship.findOne({
        $or: [
            { from_user: currentUser._id, to_user: profileUser._id },
            { from_user: profileUser._id, to_user: currentUser._id }
        ]
    });
    

    //get the friends of profile user having friendship with current user as well
    let bothCurUserAndProfUserFriends=[];
    //get the friends of profile user who are not friends of current user
    let onlyProfileUserFriends = [];

    /*
    for (let friendship of profileUser.friendships) {
        if (friendship.from_user == profileUser.id) {
            const friend = await friendship.populate('to_user', '_id avatar name');  //only populate id, avatar and name property
            profileUserFriends.push(friend.to_user);
        }
        else {
            const friend = await friendship.populate('from_user', '_id avatar name');
            profileUserFriends.push(friend.from_user);
        }
    }
    */
    for (let friendship of profileUser.friendships) {
        let friend;
        if (friendship.from_user.equals(profileUser._id)) {
            friend = (await friendship.populate('to_user', '_id avatar name')).to_user;
        } else {
            friend = (await friendship.populate('from_user', '_id avatar name')).from_user;
        }
        
        //now check if this friend is friend of currentUser also or not
        const isCurUserFriend = await Friendship.findOne({
            $or: [
                { from_user: currentUser._id, to_user: friend._id },
                { from_user: friend._id, to_user: currentUser._id }
            ]
        });        
    
        if (isCurUserFriend) {
            bothCurUserAndProfUserFriends.push(friend);
        } else {
            onlyProfileUserFriends.push(friend);
        }
    }

    return res.render('user_profile', {
        title: "Connectify | Profile",
        profile_user: profileUser,
        friendship: existingFriendship,
        only_prof_user_friends:onlyProfileUserFriends,
        both_cur_user_prof_user_friends:bothCurUserAndProfUserFriends
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
