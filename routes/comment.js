const express = require('express');
const router = express.Router();
const commentController= require('../controllers/comment_controller');
const passport=require('passport');

router.post('/create/:postId',passport.isLoggedIn, commentController.create);
router.get('/delete/:commentId',passport.isLoggedIn, commentController.delete);

module.exports = router;