//this is the main page of routing
const express= require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller')

//get all routes here
const userRouter=require('./users');
const postsRouter=require('./posts');
const commentRouter=require('./comment');


///////////////..........Routing........../////////////
//home routes
router.get('/', homeController.home);

//users routes eg(/users/profile, ..);
router.use('/users', userRouter);

//forgot password routes
router.use('/forgot-password', require('./forgot_password'));
router.use('/reset-password', require('./reset_password'));

//posts routes eg(/posts/created, ..);
router.use('/posts', postsRouter);

//comments routes eg(/posts/created, ..);
router.use('/comments', commentRouter);

//likes roues eg(/likes/toggle)
router.use('/likes', require('./likes'))

//friendships roues eg(/likes/toggle)
router.use('/friendships', require('./friendships'));

//api routes eg(/api/..)
router.use('/api', require('./api/index'))


module.exports=router;   