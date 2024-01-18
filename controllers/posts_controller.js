const Post = require('../models/post');
const User= require('../models/user');
const Comment= require('../models/comment');
const Like= require('../models/likes');

const fs=require('fs');

module.exports.createpost= function(req, res){
    res.render('create_post');
}

module.exports.create = async function (req, res) {
    try {
        if(!req.file){
            res.status(404).send("no file were given!");
        }
        
        let createdPost = await Post.create({
            image:req.file.filename,
            content: req.body.content,
            user: req.user._id,
            comments: [],
        });

        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        createdPost = await createdPost.populate('user', 'name');
        
        //when post created push id of it in current user's posts array
        const currentLoggedInUser=await User.findById(req.user._id);
        currentLoggedInUser.posts.push(createdPost._id);
        await currentLoggedInUser.save(); //imp


        //check if the request if xhr req
        // if(req.xhr){
        //     return res.status(200).json({
        //         data:{
        //             post:createdPost
        //         },
        //         message:"Post Created!"
        //     });
        // }
        
        req.flash('success', '🎉 Post published successfully!');
        return res.redirect('/');
    } catch (error) {
        req.flash('error', error);
        return res.redirect('back');
    }
}

module.exports.destroy = async function (req, res) {
    try {
        //first find the user who created the post and then check if delete requested user is same as post created user then only delete
        const post = await Post.findById(req.params.postId);

        //(req.user._id) it will not give id in string format so we can use any of below two
        // if((post.user).toString() == (req.user._id).toString()){
        if (post.user == req.user.id) {
            //delete likes associated with post
            await Like.deleteMany({
                likeable:req.params.postId,
                onModel:'Post'
            });

            //delete likes associated with comments of post and then also delete comments
            const deletedComments=await Comment.find({post:req.params.postId});
            for(let comment of deletedComments){
                await Like.deleteMany({
                    likeable:comment._id,
                    onModel:'Comment'
                });
            }
            //delete comments associated with it
            await Comment.deleteMany({post:req.params.postId});
           
            //delete image uploaded fromdb(here hd)
            if(post.image){
                fs.unlinkSync('./public/upload/'+post.image);
            }
            
            //remove id of this post from user's (who has created it(i.e current user)) posts array
            const currentLoggedInUser=await User.findById(req.user._id);
            currentLoggedInUser.posts.pull(req.params.postId);
            await currentLoggedInUser.save(); //imp

            const deletedPost = await Post.findByIdAndDelete(req.params.postId);

            //remove element using ajax so that page do not get loaded
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        postId:req.params.postId
                    },
                    message:"Post Deleted!"
                })
            }
            req.flash('success', 'Post removed successfully 🚮');
        }
        return res.redirect('back');
    } catch (error) {
        req.flash('error', error);
        return res.redirect('back');
    }
}



