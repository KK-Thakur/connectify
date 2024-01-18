// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every comments dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`.post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;     //this is pointing towards current object
        
        //check if there is submit event happen on commentForm of any post(if event happen it will detect and run fn) 
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;    //this will give the element on which submit event happend 
            //Note :- this.newCommentForm refers to all commentForm (because there will commentForm for all the posts) and above this will only provide the element on which submit event happen

            $.ajax({
                type: 'post',
                url: `/comments/create/${postId}`,
                data: $(self).serialize(),      //$(self) beacuse to wrap the DOM element into a jQuery object
                success: function(resp){
                    // console.log(resp);
                    let newComment = pSelf.newCommentDom(resp.data.comment);
                    $(`#post-comments-${postId} #no-comment`).remove();
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    $(self).find('input[name="commentContent"]').val('');
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li

        return $(`<div id="comment-${comment._id }" class="comment">
                        <div class="user-avatar">
                            <img src="/upload/${comment.user.avatar ? comment.user.avatar : 'default-avatar.jpg'}" alt="User Avatar" />
                        </div>

                        <div class="comment-content">
                            <p><span class="comment-username">${ comment.user.name }</span>: ${comment.commentContent }</p>
                            <p>Likes: ${comment.likes.length }</p>
                        </div>

                        <div class="delete-like-btn">
                            <a class="delete-comment-button" href="/comments/delete/${ comment._id }"><span>✖️</span></a>
                        </div>
                    </div>
                `);
    }
// <i class="fa-regular fa-heart icon delete-comment-button" onclick="toggleHeart(this)"></i>

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}