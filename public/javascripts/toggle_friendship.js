
$('.toggleFriend').click(function (e) {
    e.preventDefault();
    let self = this;

    $.ajax({
        type: 'GET',
        url: $(self).attr('href'),
    }).done(function (resp) {
        if (resp.data.friendAdded) {
            let newFriend= newFriendDom(resp.data.friend);
            
            $('.friendsCard-wrapper').prepend(newFriend);
            $(self).text("Remove Friend");
        } else {
            $(`#friends-card-${resp.data.friend._id }`).remove();
            $(self).text("Add Friend");
        }  
    })
    .fail(function (errData) {
        console.log('Error in completing the request');
    });

});


let newFriendDom = function (friend){
    return $(`<div class="friends-card" id="friends-card-${friend._id }">
                    <a href="/users/profile/${friend._id }">
                        <div class="profile-pic">
                            <img src="/upload/${ (friend.avatar)? friend.avatar : 'default-avatar.jpg' }" alt="">
                        </div>
                        <p class="username">${friend.name }</p>
                    </a>
                </div>`
            );
}