const express = require('express');
var router = express.Router();
const gameController = require("../controllers/gameController/gameController");
const passport = require("../config/passport");


router.post('/create', passport.classicAuth, gameController.createGame)
router.post('/join', passport.classicAuth, gameController.joinGame)
router.get('/getall', passport.classicAuth, gameController.getGames)
router.get('/getallnocondition', passport.classicAuth, gameController.getAllGames)
router.get('/isdrawer', passport.classicAuth, gameController.isDrawerInLobby)
router.get('/ispartoflobby', passport.classicAuth, gameController.isPartOfLobbyNotFinished)
router.get('/getcreatedby', passport.classicAuth, gameController.getCreatedGames)
router.post('/delete', passport.adminAuth, gameController.deleteGame)
router.post('/deleteandfetch', passport.adminAuth, gameController.deleteGameAndFetchUpdatedOnes)
router.post('/leavelobby', passport.classicAuth, gameController.leaveLobby)

module.exports = router