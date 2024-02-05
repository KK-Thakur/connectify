const User=require('../../../models/user');
//we will be using jsonwebtoken to generate token and verify it
const jwt = require('jsonwebtoken');
require("dotenv").config();

//function to login user by create JWT token 
module.exports.createSession = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });

        //if either user with gven email not found or password is wrong
        if (!user || user.password != req.body.password) {
            // console.log("Invalid userName or password"); // todo: show this on page
            return res.status(422).json({ message: 'Incorrect username or password' });
        }
        return res.status(200).json({ 
            message: 'Sign In successful, here is your token, please keep it safe!',
            data:{
                token:jwt.sign(user.toJSON(),process.env.PASSPORT_JWT_SECRET_KEY || "anysecretkey0123", {expiresIn:'15m'})
            }
        });
        //note:- done takes two argument first as err and second as data
    }catch (error) {
        console.log('Error', error);
        return res.status(500).json({
            message:"Internal Server Error!"
        })
    }
}
