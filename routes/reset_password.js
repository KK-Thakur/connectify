
const express= require('express');
const router=express.Router();
const resetPassController= require('../controllers/resest_password_controller');


// when user hit the given link
router.get('/:id/:token', resetPassController.getSetPassPage);

//when user fill the form(new password) it will post the data on route /resest-password
router.post('/:id/:token', resetPassController.resetPassword);

module.exports= router;