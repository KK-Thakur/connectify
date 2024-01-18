const queue= require('../config/kue');

const commentsMailer= require('../mailers/comments_mailer');

queue.process('emails', function(job, done){
    //call newComment fn for mailing from here instaed of comments controller file 
    commentsMailer.newComment(job.data);
    done();
});