const User= require('../models/user');
//we will be using jsonwebtoken to generate token and verify it
const jwt = require('jsonwebtoken');
const resetPasswordMailer= require('../mailers/reset_password_mailer');
require("dotenv").config();


module.exports.getForgotPage = (req, res)=>{
    res.render('forgot_password',{
        layout: 'forgot_password'
    });
}


module.exports.sendForgotLink= async(req, res)=>{
    const enteredEmail= req.body.email;
    //now check if user with this email is present in db or not
    const user=await User.findOne({email:enteredEmail});
    if(!user){
        console.log("User not registered!"); //todo show it
        return res.redirect('back');
    }
    //if user exists 
    //create a uniquie link using secret
    const jwtSecret=process.env.RESET_PASSWORD_JWT_SECRET_KEY || "anysecretkeyandhashit0123" //Todo
    const secret = jwtSecret + user.password;
    const payload={
        email:user.email,
        id:user._id
    } 
    const token=jwt.sign(payload, secret, {expiresIn:'10m'});

    //generate link from token and send it to users email
    const link=`http://localhost:8000/reset-password/${user._id}/${token}` ;
    resetPasswordMailer.sendResetPasswordLink(link, enteredEmail, user.name);

    res.send(`Reset password link sent to your email will be valid for next 10 minutes only! <a href="/users/login">Go to login page</a>`);
}