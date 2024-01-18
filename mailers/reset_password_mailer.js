const nodeMailer = require('../config/nodemailer');

//below is another way of exporting a method
exports.sendResetPasswordLink = async function(link,email, name){
    let htmlString=nodeMailer.renderTemplate({link:link, name:name}, '/reset_password_mail.ejs')
    try {
        const info = await nodeMailer.transporter.sendMail({
            from: '"Connectify 🔊" <projetcsofkt@gmail.com>', // sender address
            // from: 'projetcsofkt@gmail.com', // sender address
            to: email, // list of receivers (eg:- to send the mail to the user whose post is then include comment.post.user.email)
            subject: "Reset Password request!", // Subject line
            text: "Hello world?", // plain text body
            html: htmlString, // html body
        });
    
        // console.log("Message sent", info);
        return;

    } catch (error) {
        console.log('Error in sending mail', error);
        return;
    }
}