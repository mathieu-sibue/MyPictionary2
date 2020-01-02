const express = require('express');
var router = express.Router();
const account = require('../controllers/account/lib')
const passport = require("../config/passport");


router.post('/login', account.login)
router.post('/signup', account.signup)
router.get('/getusernames', passport.classicAuth, account.getUsernames)
//router.get('/isauth', account.isAuth)
//router.get('/isadmin', account.isAdmin)

module.exports = router