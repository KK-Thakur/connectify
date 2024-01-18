const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggleFriend = async function (req, res) {
    try {
        const currentUser = req.user;
        const friend = await User.findById(req.params.id);
        //we will keep friendAdded var and send this to front end so that for front-end we can get if friend added happen or deleted happen
        let friendAdded = false;
        
        //chaeck if friend already exists if yes delete it, if deleted return deleted element or null
        const removedFriendship = await Friendship.findOneAndDelete({
            $or: [
                { from_user: currentUser._id, to_user: friend._id },
                { from_user: friend._id, to_user: currentUser._id }
            ]
        });

        if (removedFriendship) {
            //remove id of removedFriendship from friendships array of currentUser and  friendUser
            currentUser.friendships.pull(removedFriendship._id);
            await currentUser.save();
            friend.friendships.pull(removedFriendship._id);
            await friend.save();
            console.log("friend removed");
        }
        else {
            //create friendship and in current user and friednUser
            const createdFriendship = await Friendship.create({
                from_user: req.user._id,
                to_user: req.params.id,
            });

            // Also save the friendship id in the array of friendship of user schema
            currentUser.friendships.push(createdFriendship._id);
            await currentUser.save();
            friend.friendships.push(createdFriendship._id);
            await friend.save();
            friendAdded = true;

            console.log("Friend added");
        }

        if(req.xhr){
            return res.status(200).json({
                message: "Friend removed/added successfully!",
                data: {
                    friendAdded: friendAdded,   //in this we will send if friend added or not-added(i.e. removed)
                    friend:friend    //here we will send which friend added or removed , so that we can remove from front-end
                }
            })
        }

        return res.redirect('back');

    } catch (error) {
        console.log('Error in adding friend', error);
        return res.status(500).json({
            message: 'Internal server error!'
        })
    }
}