const Game = require("../models/Game");
const Score = require("../models/Score");
const Word = require("../models/Word")


async function getUsersInLobby(lobbyId) {
    try {
        const userList = await Score.find({ lobbyId: lobbyId })
        return userList
    } catch(error) {
        console.log(error)
    }
}


async function userLeavesLobby(lobbyId, userId) {           //lorsqu'un guesser quitte la partie
    try {
        const lobbyToLeave = await Game.findById({ _id: lobbyId });
        var updatedParticipants = lobbyToLeave.participants;
        updatedParticipants = updatedParticipants.filter(playerId => playerId !== userId)
        await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
            {
                participants: updatedParticipants
            }
        });
        await Score.deleteOne({ lobbyIdAndUserId: { lobbyId: lobbyId, userId: userId }});
    } catch (error) {
        console.log(error);        
    }     
}


async function getLobbyInfo(lobbyId) {
    const lobby = await Game.findById(lobbyId);
    const currentWord = await Word.findOne({ word: lobby.wordsUsed[lobby.currentRound-1] });
    if (lobby.currentRound > 0) {
        return { 
            lobbyName: lobby.lobbyName,
            roundNb: lobby.roundNb, 
            maxNbParticipants: lobby.maxNbParticipants, 
            currentRound: lobby.currentRound, 
            roundOnGoing: lobby.roundOnGoing,
            currentWord: currentWord.word,
            currentWordDescription: currentWord.description,
            prevWinner: lobby.prevWinner
        }
    } else {
        return { 
            lobbyName: lobby.lobbyName,
            roundNb: lobby.roundNb, 
            maxNbParticipants: lobby.maxNbParticipants, 
            currentRound: lobby.currentRound, 
            roundOnGoing: lobby.roundOnGoing,
            currentWord: "",
            prevWinner: ""
        }        
    }

}


//fonction dépréciée car création d'objet score déjà implémentée lorsque le user rejoint la partie
/*
async function createScoreObject(username, userId, lobbyId) {
    await Score.create({
        lobbyId: lobbyId,
        username: username,
        userId: userId,
        //value: 0
    })
}
*/


async function initializeWordList(lobbyId) {
    const lobby = await Game.findById(lobbyId);
    var randomWordList = await Word.aggregate([{ $sample: { size: lobby.roundNb } }]);
    randomWordList = randomWordList.map(wordObject => wordObject.word);
    try {
        await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
            {
                wordsUsed: randomWordList
            }
        });
    } catch (error) {
        console.log(error);        
    }         
    return randomWordList
}


async function getWordInfoForRound(lobbyId, currentRound) {               
    const lobby = await Game.findById(lobbyId);
    const wordList = lobby.wordsUsed;
    const wordForNextRound = wordList[currentRound];
    let wordDescription = await Word.find({ word: wordForNextRound });
    wordDescription = wordDescription[0].description;
    return { wordForNextRound, wordDescription }
}


//fonction dépréciée
/*
async function hasAlreadyJoined(userId, lobbyId) {
    const res = await Score.find({ userId: userId, lobbyId: lobbyId })
    console.log("hasn't joined: "+ (res === []))
    return res !== []
}
*/


async function finishGameAndDeleteScores(lobbyId) {
    try {
        await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
            {
                finished: true,
                roundOnGoing: false
            }
        });
        await Score.deleteMany({ lobbyId: lobbyId });
    } catch (error) {
        console.log(error);        
    }      
}


async function gameIsFinished(lobbyId) {
    try {
        await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
            {
                finished: true,
                roundOnGoing: false
            }
        });
    } catch (error) {
        console.log(error);        
    }      
}


async function incrementRoundCount(lobbyId) {
    try {
        const lobbyToIncrement = await Game.findById({ _id: lobbyId });
        const currentRound = lobbyToIncrement.currentRound;        
        await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
            {
                currentRound: currentRound+1
            }
        });
    } catch (error) {
        console.log(error);        
    }
}


async function updateScoreOfWinner(userId, lobbyId) {
    try {
        const scoreToUpdate = await Score.find({ lobbyIdAndUserId: { lobbyId: lobbyId, userId: userId } });
        const currentScoreValue = scoreToUpdate[0].value;       
        await Score.findOneAndUpdate({ lobbyIdAndUserId: { lobbyId: lobbyId, userId: userId } }, {$set:
            {
                value: Number(currentScoreValue)+Number(1)
            }
        });
    } catch (error) {
        console.log(error);        
    }    
}


async function updateRoundOnGoing(lobbyId) {
    try {
        const lobbyToUpdate = await Game.findById(lobbyId);     
        const roundOnGoing = lobbyToUpdate.roundOnGoing;
        await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
            {
                roundOnGoing: !roundOnGoing
            }
        });
    } catch (error) {
        console.log(error);        
    }      
}


async function setPreviousWinner(lobbyId, winnerUsername) {
    try {       
        await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
            {
                prevWinner: winnerUsername
            }
        });
    } catch (error) {
        (error);        
    }    
}


exports.getUsersInLobby = getUsersInLobby;
exports.userLeavesLobby = userLeavesLobby;
exports.getLobbyInfo = getLobbyInfo;
//exports.createScoreObject = createScoreObject;
exports.initializeWordList = initializeWordList;
exports.getWordInfoForRound = getWordInfoForRound;
//exports.hasAlreadyJoined = hasAlreadyJoined;
exports.finishGameAndDeleteScores = finishGameAndDeleteScores;
exports.gameIsFinished = gameIsFinished;
exports.incrementRoundCount = incrementRoundCount;
exports.updateScoreOfWinner = updateScoreOfWinner;
exports.updateRoundOnGoing = updateRoundOnGoing;
exports.setPreviousWinner = setPreviousWinner;

