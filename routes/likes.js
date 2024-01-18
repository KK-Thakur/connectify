const express= require('express');
const router= express.Router();
const passport=require('passport');

const likeController= require('../controllers/like_controller');

router.get('/toggle/' ,passport.isLoggedIn, likeController.toggle);
module.exports=router;