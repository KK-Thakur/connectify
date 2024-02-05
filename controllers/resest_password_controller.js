const User= require('../models/user');
//we will be using jsonwebtoken to generate token and verify it(i this file used for verifcation)
const jwt = require('jsonwebtoken');

require("dotenv").config();

const jwtSecret=process.env.RESET_PASSWORD_JWT_SECRET_KEY || "anysecretkeyandhashit0123" //Todo


// when user hit the given link
module.exports.getSetPassPage = async(req, res)=>{
    const {id, token}= req.params;
    
    //check if user with this id is in db or not, because user may have changed the
    const user= await User.findById(id);
    if(!user){
        console.log("Invalid Link!"); //todo show it
        return res.redirect('back');
    }
    //also check if token is valid or not
    const secret = jwtSecret + user.password;
    try {
        const payload= jwt.verify(token, secret);
        return res.render('reset_password',{
            email:user.email,
            layout: 'reset_password'   //dont want to apply Layout to this page
        });  
    } catch (error) {
        return res.send(error.message);
    }
}

//when user fill the form(new password) it will post the data on route /resest-password
module.exports.resetPassword=async(req, res)=>{
    //get the data and save in db after validation 
    const {id, token}= req.params;
    const {newPassword, confirmNewPassword}= req.body;

    //check if user with this id is in db or not, because user may have changed the
    const user= await User.findById(id);
    if(!user){
        console.log("Invalid Link!"); //todo show it
        return res.redirect('back');
    }
    //also check if token is valid or not
    const secret = jwtSecret + user.password;
    try {
        const payload= jwt.verify(token, secret);
        //new password and confirmNewPassword should match
        if(newPassword !== confirmNewPassword){
            console.log("password and confirm password should be same!");  //todo: show notification or error
            return res.redirect('back');
        }

        //else change the password of user
        user.password=newPassword;
        await user.save();
        
        //after resetting notify the user and redirect to login page
        console.log('Password reset sucessfull!'); //Todo show alert
        return res.redirect('/users/login'); 
    } catch (error) {
        return res.send(error.message);
    }
}