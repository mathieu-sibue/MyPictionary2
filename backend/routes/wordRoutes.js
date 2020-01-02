const express = require('express');
var router = express.Router();
const wordController = require('../controllers/wordController/wordController')
const passport = require("../config/passport");


router.post('/create', passport.adminAuth, wordController.addWord)
router.get('/getall', passport.classicAuth, wordController.getWords)
//router.post('/modify', passport.adminAuth, wordController.modifyWord)
//router.post('/delete', passport.adminAuth, wordController.deleteWord)
router.post('/modifyandfetch', passport.adminAuth, wordController.modifyWordAndFetchOthers)
router.post('/deleteandfetch', passport.adminAuth, wordController.deleteWordAndFetchOthers)


module.exports = router