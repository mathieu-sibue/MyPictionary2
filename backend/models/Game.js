const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    wordsUsed: Array,   //of words FOR NOW (=> A CHAQUE MANCHE, FAIRE UN NOUVEL APPEL A LA BASE DE DONNEES DE MOTS EN FAISANT GAFFE A CE QU'ELLE RESSORTE PAS 2 FOIS UN DES MOTS DE wordsUsed)
    participants: Array,    //of user IDs, but not the case in this first implementation of the app...
    creator: String, //or ID?
    createdAt: {
        type: Date
    },
    roundNb: {type: Number, required: true},
    //scores?
    currentRound: {type: Number, default: 0},
    maxNbParticipants: {type: Number, required: true},
    lobbyName: String,
    finished: Boolean,
    roundOnGoing: Boolean,
    prevWinner: String
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game