const Post = require('../models/post');
const Comment = require('../models/comment');
const Likes= require('../models/likes');


// const commentsMailer= require('../mailers/comments_mailer')
const commentEmailWorker= require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function (req, res) {
    try {
        //getting post_id in params req.params.postId
        let createdComment = await Comment.create({
            commentContent: req.body.commentContent,
            user: req.user._id,
            post: req.params.postId,
        });

        const commented_post = await Post.findById(req.params.postId);
        commented_post.comments.push(createdComment._id);
        await commented_post.save();
        
        createdComment = await createdComment.populate('user', 'name email avatar');
        
        //send email that comment is published using queue
        // commentsMailer.newComment(createdComment);
        let job=queue.create('emails', createdComment).save(function(err){
            if(err){
                console.log('Error in creating queue');
            }
            else{
                // console.log('job enqueued: ',job.id);
            }
        });

        //show commented text without refreshing using AJAX
        if (req.xhr){
            return res.status(200).json({
                data: {
                    comment: createdComment
                },
                message: "Comment created!"
            });
        }


        req.flash('success', 'Comment published!');

        res.redirect('/');
    } catch (error) {
        console.log('Error', error);
    }
}

module.exports.delete = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (comment.user == req.user.id) {
            let postId = comment.post;
            //note before actually deleting comment from db delete comment(id) from post
            //find that post containing this comment and update comments array of post by removing this comment

            /*
            const post = await Post.findById(postId);
            //find index of this comment in comments array of post and delete it
            const index = post.comments.indexOf(req.params.commentId);
            post.comments.splice(index, 1);
            await post.save();
            */
            //or
            const updatedPost = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.commentId } });

            //delete likes associated with this comment
            await Likes.deleteMany({
                likeable:req.params.commentId,
                onModel:'Comment'
            });

            //now, delete actual comment from db
            const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.commentId
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
        }
        return res.redirect('back');
    } catch (error) {
        console.log('Error', error);
    }
}