const mongoose= require('mongoose');

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true 
    },
    avatar:{
        type:String,   //store name of file
    },
    tagline:{
        type:String 
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    //add array of posts done by user
    friendships:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Friendship'
    }]
},{
    timestamps:true
})

const User=mongoose.model('User', userSchema);
module.exports=User;