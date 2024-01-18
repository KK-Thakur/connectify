const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function (req, res) {
    const posts = await Post.find().sort('-createdAt').populate('user', "name").populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'user',
            select: 'name' // Select only the 'name' field of the 'user'
            // select: 'name email' // Select multiple fields for the 'user' in 'comments'
            // select: '-_id' // Exclude both '_id' fields from user in comments
        }
    });
    return res.status(200).json({
        message: "List of posts",
        posts: posts
    });
}


module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (post.user == req.user.id) {
            //remove comments and then post from db
            await Comment.deleteMany({ post: req.params.postId });
            const deletedPost = await Post.findByIdAndDelete(req.params.postId);

            return res.status(200).json({
                message: "Post Deleted Successfully",              
                post: deletedPost
            });
        }
        else{
            return res.status(401).json({
                message: "You are not authorized to delete this post!"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}