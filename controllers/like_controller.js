const Like= require('../models/likes');
const Post= require('../models/post');
const Comment= require('../models/comment');

module.exports.toggle= async function(req, res){
    try {
        //we will keep deleted var and send this so that for front-end we can get if delete happen or create happen
        let deleted=false;  
        
        //store in variable on which post or comment toggle event happen
        let likeable;   //in this we will store particaluar post or comment(not type) on which like event happend
        if(req.query.type == 'Post'){
            likeable=await Post.findById(req.query.id);
        }else{
            likeable=await Comment.findById(req.query.id);
        }

        //find if current user has liked this post or not
        let alreadyLiked= await Like.findOne({
            user:req.user._id,
            likeable: req.query.id,
            onModel:req.query.type
        });

        if(alreadyLiked){
            //delete this like and also remove from likes array of post/comment(on whhick toggle event happen)
            await Like.findOneAndDelete({
                user:req.user._id,
                likeable: req.query.id,
                onModel:req.query.type
            });
            likeable.likes.pull(alreadyLiked._id);
            await likeable.save();

            //here we have deleted like
            deleted=true;
        }
        else{
            //create like and push id of it in likes array of post/comment(on whhick toggle event happen)
            const newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });

            likeable.likes.push(newLike._id);
            await likeable.save();
        }

        if (req.xhr){
            return res.status(200).json({
                data: {
                    deleted:deleted
                },
                message: "Like toggle suceesfull"
            });
        }
        //we can do req.xhr
        return res.redirect('back');
    } catch (error) {
        console.log('Error', error);
        return res.status(500).josn({
            message:'Internal server error!'
        })
    }
}