const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypts = require('bcrypt');

const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt.js');

router.get('/', user_jwt, async(req, res, next)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user: user
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        })
        next();
    }
})

router.post('/register', async (req, res, next) => {
    const {username, email, password} =req.body
    try {
        let user_exist = await User.findOne({email: email});
        if(user_exist){
            return res.status(400).json({
                success: false,
                msg: 'User alreay exists'
            })
        }
        let user = new User();
        user.username = username;
        user.email = email;

        const salt = await bcrypts.genSalt(10);
        user.password = await bcrypts.hash(password, salt);

        let size=200;
        user.avatar = "https://gravatar.com/avatar/?s="+size+"&d=retro";

        await user.save();

        const payload = {
            user:{
                id: user.id
            }
        }
        
        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        },(err, token)=>{
            if(err) throw err;
            res.status(200).json({
                success: true,
                token: token
            })
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        let user = await User.findOne({email: email});
        if(!user){
            res.status(400).json({
                success: false,
                msg: 'User not exists go & registrer to continue'
            })
        }
        const isMatch = await bcrypts.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                msg: 'Invalid password'
            })
        }

        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        },(err, token)=>{
            if(err) throw err;
            res.status(200).json({
                success: true,
                msg: 'User logged in',
                token: token,
                user: user
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        })
    }
})

module.exports = router;