const express= require('express');
const router= express.Router();
const passport=require('passport');
const friendshipController= require('../controllers/friendship_controller');

router.get('/toggle/:id',passport.isLoggedIn, friendshipController.toggleFriend);

module.exports= router;