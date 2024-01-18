
const express= require('express');
const router=express.Router();
const forgetPasswordController= require('../controllers/forgot_password_controller');


// when user click on forgot password btn
router.get('/',forgetPasswordController.getForgotPage);

//when user fill the form(i.e. provide the email) it will post the data on route /forgot-password
router.post('/', forgetPasswordController.sendForgotLink);

module.exports= router;