const express = require('express');
const router = express.Router();
const postController= require('../controllers/posts_controller');
const passport=require('passport');
const upload=require('../config/multer');

router.get('/createpost',passport.isLoggedIn, postController.createpost);
router.post('/create',passport.isLoggedIn,upload.single("post-file"), postController.create);
router.get('/delete/:postId', passport.isLoggedIn, postController.destroy);

module.exports = router;