const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship'); // Import the Friendship model
const Chat= require('../models/chat');

module.exports.home = async function (req, res) {
    try {
        //get all posts and populate user field(which is nothing but id of user) and also populate comments field of posts
        //then inside all comments populate user field and likes field
        //note:- post user may be different from comment user
        const posts = await Post.find().sort('-createdAt').populate('user').populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: [
                { path: 'user' },
                { path: 'likes' } // Populate the likes field for each comment
            ]
        }).populate('likes');

        //get all users and friends of current user without password field and send it to show in home.ejs
        const users = await User.find({}, { password: 0 }).sort('-createdAt');   //{ password: 0 } iused to exclude passsword field of users

        //get all friends of current logged in user
        let currentUserFriends = [];
        let currentUserFriendsIds=[];   //we are taking this array to get non-friends by excluding the users with these ids
        let currentUserNonFriends = [];
        if (req.user) {
            const currentLoggedInUser = await User.findById(req.user._id, { password: 0 }).populate({
                path: 'friendships',
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: 'from_user', select: { password: 0 } },
                    { path: 'to_user', select: { password: 0 } }
                ]
            });

            // Find the friends of the current user
            for (let friendship of currentLoggedInUser.friendships) {
                if (friendship.from_user.id == req.user.id) {
                    currentUserFriends.push(friendship.to_user);
                    currentUserFriendsIds.push(friendship.to_user._id);
                }
                else {
                    currentUserFriends.push(friendship.from_user);
                    currentUserFriendsIds.push(friendship.from_user._id);
                }
            }

            // Find users who are not friends of the current user
            currentUserFriendsIds.push(req.user._id);   //we are pushing current user's id because we dont want to show current as as non-friend of it self
            currentUserNonFriends = await User.find({
                _id: { $nin: currentUserFriendsIds }  //the $nin operator in MongoDB is used to exclude documents where a specific field value is not in a provided array.
            }, { password: 0 }).sort('-createdAt');

            // Now 'nonFriends' contains the users who are not friends of the current user
            // console.log(currentUserNonFriends);
            // console.log(currentUserFriends);
        }


        //get all chats
        const allChats = await Chat.find({}).populate('user', '-password');
        // console.log(allChats);

        return res.render('home', {
            title: "Connectify | Home",
            posts: posts,
            all_users: users,
            current_user_friends: currentUserFriends,
            current_user_non_friends: currentUserNonFriends,
            all_chats:allChats
        })
    } catch (error) {
        console.log('Error', error);
    }
}