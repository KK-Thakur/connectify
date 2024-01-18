const mongoose = require('mongoose');

const commentModel= new mongoose.Schema({
    commentContent:{
        type:String,
        required:true,
    },
    //comment belongs to user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
},{timestamps:true});

const Comment= mongoose.model('Comment', commentModel);
module.exports=Comment;