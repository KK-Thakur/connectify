function socketConnectionHandler(user) {
    var socket = io();  //connection established between frontEnd socket and backend socket, i.e. between subscriber(client) and observer(server)

    socket.on('connect', () => {
        // console.log('connection established between frontEnd socket and backend socket');
    })

    //send meassage to observer(server) using socket.emit('message-name', message you want to send);
    socket.emit('join_room', {
        user_email: user.email,
        chatRoom: 'connectify'
    });

    //get meassage from observer(server) using socket.on('message-name', (message)=>{});
    socket.on('user_joined', (message) => {
        // console.log('a new user joined the room', message);
        //now use this message to show in front- end
    })

    //send mesg in clicking send btn
    $('#send-chat-msg-btn').click((e) => {
        e.preventDefault();
        let msg = $('#chat-message-input').val();

        //emit this message if not empty
        if (msg) {
            socket.emit('chat_message', {
                user_id: user._id,
                user_name: user.name,
                user_avatar: user.avatar,
                chatRoom: 'connectify',
                chatMsg: msg
            });
        }
    })

    //get the emited messge by server and so it on front-end side
    socket.on('receive_message', (message) => {
        // console.log('message received', message);

        //create new chat element Dom
        let newMessageDom = $('<li>');

        //see if message is done by self or other and set classs as per that
        let msgType = 'other-message';
        if (message.user_id == user._id) {
            msgType = 'self-message';
        }
        newMessageDom.addClass(msgType);

        //crate a span tag and append it inside li tag
        newMessageDom.append($('<img>', {
            'src': `/upload/${message.user_avatar ? message.user_avatar: 'default-avatar.jpg'}`,
            'class': 'sender-img'
        }));

        newMessageDom.append($('<span>', {
            'html': message.chatMsg
        }));

        newMessageDom.append($('<sub>', {
            'html': message.user_name
        }));

        //appent craeted chat in list
        $('#chat-messages-list').append(newMessageDom);

        $('#chat-message-input').val('');

        // Scroll to the bottom of the chat box
        let chatBox = $('#chat-messages-list');
        //chatBox.scrollTop(chatBox[0].scrollHeight);

        // Check if the scroll position is already at the bottom
        let isAtBottom = chatBox.scrollTop() + chatBox.innerHeight() >= chatBox[0].scrollHeight;

        // Scroll to the bottom only if already at the bottom
        if (isAtBottom) {
            chatBox.scrollTop(chatBox[0].scrollHeight);
        }

    });
}