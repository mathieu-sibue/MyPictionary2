const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
    word: { type: String, unique: true },
    description: String,
    author: String, //id of users
    createdAt: { 
        type: Date 
    }
});

const Word = mongoose.model('Word', WordSchema);

module.exports = Word