{
    /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
    function showDropDown(postId) {
        var dropdown = document.getElementById("myDropdown-" + postId);
        dropdown.classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(function (dropdown) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
        }
    }  
    
    
    /*comment section*/
    function toggleCommentSection(postId) {
        const overlay = document.getElementById(`comments-overlay-${postId}`);
        overlay.classList.toggle('hidden');
        document.body.classList.toggle('no-scroll'); // Toggle no-scroll class on body
    }
    
    function closeCommentSection(postId) {
        const overlay = document.getElementById(`comments-overlay-${postId}`);
        overlay.classList.add('hidden');
        document.body.classList.remove('no-scroll'); // Remove no-scroll class from body
    }
    


    // ...........................................AJAX..........................................................

    /*
    //method to submit the form data of new post using ajax
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(), //converts form data into json
                success: function (resp) {
                    // console.log(resp);
                    let newPost = newPostDOm(resp.data.post);
                    $('#posts-list-container>ul').prepend(newPost);

                    // deletePost($('#posts-list-container>ul .delete-post-button'));
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(resp.data.post._id);

                    new Noty({
                        theme: 'relax',
                        text: '🎉 Post published successfully!',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function (err) {
                    console.log(err);
                }
            })
        })
    }

    //function to create a post DOM

    let newPostDOm = function (post) {
        return $(`<li id="post-${post._id}">
                    <p>
                        ${post.content}
                            <br>
                        ${post.user.name}
                    </p>

                    <a class="delete-post-button" href="/posts/delete/${post._id}"> <button>Delete</button> </a>
                    
                    <div class="detailBox">
                        <div class="titleBox">
                            <label>Comment Box</label>
                            <button type="button" class="close" aria-hidden="true">&times;</button>
                        </div>
                        <div class="actionBox">
                            <form action="/comments/create/${post._id}" method="POST" class="form-inline"
                                role="form">
                                <div class="form-group">
                                    <input name="commentContent" class="form-control" type="text"
                                        placeholder="Your comments.."
                                        required
                                    />
                                </div>
                                <div class="form-group">
                                    <button type="submit" 
                                        class="btn btn-default"
                                        
                                    >Add</button>
                                </div>
                            </form>
                            <ul id="post-comments-${post._id}" class="commentList">
                            </ul>
                        </div>
                    </div>
                </li>`)
    }

    */

    //function to delete a post from DOM using AJAX
    let deletePost = function (deleteLink) {
        //deleteLink is nothing but '<a href="">' tag
        $(deleteLink).click(function (e) {
            // console.log(deleteLink);
            e.preventDefault();

            
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (resp) {
                    let id = resp.data.postId;
                    //remove element
                    $(`#post-${id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post removed successfully   🚮",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function (err) {
                    console.log(err.responseText);
                }
            })
            
        })
    }
    
    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function () {
        $('#posts-list-container>div').map(function (index, divElement) {  //in jquery first arg is always index while using foreach or map
            // let divElement = $(this);   //we can get data in this way also , $(this) beacuse to wrap the DOM element into a jQuery object
            let deleteButton = $(' .delete-post-button', divElement);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = $(divElement).prop('id').split("-")[1]; //The reason for using $(self) or $(this) inside jQuery callbacks is to wrap the DOM element into a jQuery object.
            new PostComments(postId);
            
        });
    }

    // createPost();
    convertPostsToAjax();
    
}