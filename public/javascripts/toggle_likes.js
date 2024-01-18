{
 
    //function to toggle like button of a post using AJAX
    $('.post-like-toggle').click(function (e) {
        e.preventDefault();
        let self = this;
        let postId = $(self).data('postid'); // Assuming you have a data attribute for post ID

        $.ajax({
            type: 'GET',
            url: $(self).attr('href'),
        })
            .done(function (data) {
                let likesCount = parseInt($(`#post-num-likes-${postId}`).text());

                if (data.data.deleted) {
                    likesCount -= 1;
                } else {
                    likesCount += 1;
                }
                $(`.icon-${postId}`).toggleClass('fa-solid fa-regular');
                $(`#post-num-likes-${postId}`).text(likesCount);
                $(`#post-num-likes2-${postId}`).text(likesCount);
            })
            .fail(function (errData) {
                console.log('Error in completing the request');
            });
    });



    //function to toggle like button of a comment using AJAX
    $('.comment-like-toggle').click(function (e) {
        e.preventDefault();
        let self = this;
        let commentId = $(self).data('commentid'); // Assuming you have a data attribute for comment ID

        $.ajax({
            type: 'GET',
            url: $(self).attr('href'),
        })
        .done(function (data) {
            let likesCount = parseInt($(`#comment-num-likes-${commentId}`).text());

            if (data.data.deleted == true) {
                likesCount -= 1;
            } else {
                likesCount += 1;
            }
            
            $(`#comment-num-likes-${commentId}`).text(likesCount);

            $(self).find('i').toggleClass('fa-solid fa-regular');
        })
        .fail(function (errData) {
            console.log('error in completing the request');
        });
    });
}