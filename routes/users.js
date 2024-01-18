const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller')
const passport = require('passport');
const upload=require('../config/multer');

// route=> /users/signup
router.get('/signup', userController.signup);

// route=> /users/login
router.get('/login', userController.login);

// route=> /users/profile
router.get('/profile/:userId', passport.isLoggedIn, userController.profile);
router.get('/profile/update/1', passport.isLoggedIn, userController.profileUpdate);

// route=> /users/posts
router.get('/posts', userController.posts);

// route=> /users/logout
router.get('/logout', userController.deleteSession);


//sign in via google
//router for sign in with google-oauth, below route will send user to get verify by user email(the pop-up it shoows)
router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
//after getting verified from above route it will send to below route with user datas where if failure happen then return otherwise login the user(code for it written in userController.createSession)
router.get('/auth/google/callback', passport.authenticate('google',{
    failureRedirect: '/users/login',
    failureFlash:true
}), userController.createSession)




//------------->post methods<--------------------//
router.post('/update', passport.isLoggedIn,upload.single('avatar'), userController.updateUser);

// route=> /users/register
router.post('/register', userController.createUser);

//for login
router.post('/create-session', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash:true
}),userController.createSession);

module.exports = router;