const express = require('express')
const router = express.Router()
const { register, login ,updateUser} = require('../controllers/auth')
const authenticateUser=require('../middleware/authentication')
const { update } = require('../models/User')
const testUser=require('../middleware/testUser');
const rateLimiter=require('express-rate-limit');

const apiLimiter=rateLimiter({
    windowMs:15*60*1000,//15 minutes
    max:10,
    message:{
        msg:'too many login/signups from this ip, try again after 15 minutes'
    }
})

//previously hamne poore project pr lga diya tha ye
//is baar hamne sirf login/signup pr lagaya hai

router.post('/register',apiLimiter, register)
router.post('/login', apiLimiter,login)

router.patch('/updateUser',authenticateUser,testUser,updateUser)
//apna demo user profile update nhi kr paega
module.exports = router
