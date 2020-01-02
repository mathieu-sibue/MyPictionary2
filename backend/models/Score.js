const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
    lobbyIdAndUserId: {
        type: { lobbyId: String, userId: String },
        required: true,
        unique: true
    },
    lobbyId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 0
    }
});

const Score = mongoose.model('Score', ScoreSchema);

module.exports = Score