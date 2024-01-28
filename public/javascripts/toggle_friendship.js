
$('.toggleFriend').click(function (e) {
    e.preventDefault();
    let self = this;

    $.ajax({
        type: 'GET',
        url: $(self).attr('href'),
    }).done(function (resp) {
        if (resp.data.friendAdded) {
            let newFriend = newFriendDom(resp.data.friend);

            $('.friendsCard-wrapper').prepend(newFriend);
            $(self).text("Unfriend");
        } else {
            $(`#friends-card-${resp.data.friend._id}`).remove();
            $(self).text("Friend");
        }
    })
        .fail(function (errData) {
            console.log('Error in completing the request');
        });

});


let newFriendDom = function (friend) {
    return $(`<div class="friends-card" id="friends-card-${friend._id}">
                    <a href="/users/profile/${friend._id}">
                        <div class="profile-pic">
                            <img src="/upload/${(friend.avatar) ? friend.avatar : 'default-avatar.jpg'}" alt="">
                        </div>
                        <p class="username">${friend.name}</p>
                    </a>
                </div>`
    );
}



//js to show pop-up for showing all friends
const showFriendsBtn = document.getElementById('showFriendsBtn');
const friendsOverlay = document.getElementById('friendsOverlay');
const closeBtn = document.getElementById('closeBtn');

// Show followers overlay
showFriendsBtn.addEventListener('click', function () {
    friendsOverlay.style.display = 'block';
});

// Close followers overlay
closeBtn.addEventListener('click', function () {
    friendsOverlay.style.display = 'none';
}); 