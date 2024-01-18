const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    message: {
        type: String,
        required: true
    }
},{timestamps:true});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
