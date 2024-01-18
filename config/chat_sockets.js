const Chat= require('../models/chat');

const { Server } = require("socket.io");

module.exports.chatSockets = function (chatServer) {
    const io = new Server(chatServer);

    io.on('connection', (socket) => {
        console.log('a new user connected', socket.id);
        //get message comming from front-end and then emit this message to all using socket.on('message-name', (message)=>{ io.emit('message-name', message);})
        socket.on('join_room', (message)=>{
            // console.log(message);
            //now make join that user to the room using socket.join('room name')
            socket.join(message.chatRoom);

            //now notify the all already connected user(in chat room) that this new has joined
            io.in(message.chatRoom).emit('user_joined', message);
        });

        socket.on('chat_message', async (message)=>{
            io.in(message.chatRoom).emit('receive_message', message);

            //also save the chat message in database
            await Chat.create({
                user:message.user_id,
                message:message.chatMsg
            });
        })


        //on disconnection of socket(i.e. user)
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        
    });
}