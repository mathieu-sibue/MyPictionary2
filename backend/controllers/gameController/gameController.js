const Game = require("../../models/Game");
const Score = require("../../models/Score");
const Word = require("../../models/Word")


async function createGame(req, res) {
    const { lobbyName, roundNb, maxNbParticipants, creatorId } = req.body
    if (!lobbyName || !roundNb || !maxNbParticipants) {
        return res.status(400).json({
          text: "Requête invalide : manque des champs à remplir"
        });
    }

    const wordCount = (await Word.find()).length
    if (roundNb > wordCount) {
        return res.status(400).json({
            text: "Requête invalide : nombre de rounds supérieur au nombre de mots stockés en base"
        });
    }

    try {                           //ON NE CREE PAS DE SCORE POUR LE CREATEUR DE LA PARTIE 
        let createdGame;
        await Game.create({
            lobbyName: lobbyName,
            roundNb: roundNb,
            maxNbParticipants: maxNbParticipants,
            wordsUsed: [],
            participants: [creatorId],
            currentRound: 0,
            creator: creatorId,
            createdAt: new Date(),
            finished: false,
            roundOnGoing: false,
            prevWinner: ""
        }).then(gameDocCreated => createdGame = gameDocCreated);
        return res.status(201).json({ text: `Succès : lobby ${lobbyName} créé`, createdGameId: createdGame._id })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })         
    }
}


async function getGames(req, res) {
    const isFinished = JSON.parse(req.query.isFinished);
    try {
        if (isFinished === true) {
            const gameList = await Game.find({ finished: true });
            return res.status(200).json({ text: "Succès", gameList })            
        } else {
            const gameList = await Game.find({ $where: function () {return (this.participants.length < this.maxNbParticipants && this.finished === false)} });    // on ne montre que les lobbies non remplis/finis
            return res.status(200).json({ text: "Succès", gameList })        
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}


async function getAllGames(req, res) {
    try {
        const gameList = await Game.find({})
        return res.status(200).json({ text: "Succès", gameList })       
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }  
}


async function getCreatedGames(req, res) {
    const userId = req.query.creator;
    try {
        if (userId) {
            const gameList = await Game.find({ creator: userId, finished: true });
            return res.status(200).json({ text: "Succès", gameList })            
        } else {
            return res.status(400).json({
                text: "Requête invalide : manque des champs à remplir"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}


async function joinGame(req, res) {
    const { gameId, joiningPlayerId, joiningPlayerUsername } = req.body;
    try {
        const gameToJoin = await Game.findById({ _id: gameId });
        const participants = gameToJoin.participants;
        if (participants.includes(joiningPlayerId)) {
            return res.status(400).json({ text: "On ne peut pas rejoindre sa propre partie" })
        } 
        if (gameToJoin.finished) {
            return res.status(400).json({ text: "La partie est finie: actualiser la page" })
        }

        await Score.create({                //on crée un score pour un viewer dès qu'il rejoint la partie en utilisant le bouton "join!"
            lobbyIdAndUserId: { lobbyId: gameId, userId: joiningPlayerId },
            lobbyId: gameId,
            username: joiningPlayerUsername,
            userId: joiningPlayerId,
            value: 0
        });
        participants.push(joiningPlayerId)

        await Game.findOneAndUpdate({ _id: gameId }, {$set:
            {
                participants: participants
            },
        },
        {new: true}
        )
        return res.status(201).json({ text: `Partie ${gameId} rejointe avec succès` })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }        
}


async function deleteGame(req, res) {           //pour des jeux finis, côté admin
    const { gameId } = req.body;
    try {
        await Game.deleteOne({ _id: gameId });
        return res.status(200).json({ text: `Succès : partie achevée supprimée` }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }    
}


async function isDrawerInLobby(req, res) {      //pour vérifier que le user est bien le créateur/dessinateur dans le lobby (car pas de contexte...)
    const { userId, lobbyId } = req.query;
    try {
        const lobby = await Game.findById(lobbyId);
        return res.status(200).json({ text: "Succès", isDrawer: (userId === lobby.creator) }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }
}


async function isPartOfLobbyNotFinished(req, res) {     //pour vérifier que le user qui cherche à rejoindre le lobby en fait bien partie ET que le lobby n'est pas clôt
    const { userId, lobbyId } = req.query;
    try {
        const lobby = await Game.findById(lobbyId);
        if (lobby.finished) {
            return res.status(200).json({ text: "Partie finie", isPartOfLobbyNotFinished: false })
        }
        if (lobby.participants.includes(userId)) {
            return res.status(200).json({ text: "Partie en cours dont user fait partie", isPartOfLobbyNotFinished: true })   
        } else {
            return res.status(200).json({ text: "Partie en cours dont user ne fait pas partie", isPartOfLobbyNotFinished: false })
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error, isPartOfLobbyNotFinished: false })        
    }
}


async function leaveLobby(req, res) {           
    //fonction permettant, si on est simple guesser d'une partie, permet de la quitter tout en détruisant son score ; si on est dessinateur, set la partie à "finie" et détruit les scores (=> le créateur a voulu mettre un terme à la partie en cours)
    const { userId, lobbyId, isCreatorOfGame } = req.body;
    if (isCreatorOfGame) {
        try {
            await Game.findOneAndUpdate({ _id: lobbyId }, {$set:
                {
                    finished: true
                }
            });
            await Score.deleteMany({ lobbyId: lobbyId });
            return res.status(200).json({ text: "Succès : partie close et scores détruits" })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error })       
        } 
    } else {
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
            return res.status(200).json({ text: "Succès : score de l'utilisateur détruit" })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error })  
        }     
    }
}


async function deleteGameAndFetchUpdatedOnes(req, res) {
    const { gameId } = req.body;
    try {
        await Game.deleteOne({ _id: gameId });
        const gameListUpdated = await Game.find();
        return res.status(200).json({ text: `Succès : partie achevée supprimée`, games: gameListUpdated }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })        
    }   
}


exports.createGame = createGame;
exports.getGames = getGames;
exports.getCreatedGames = getCreatedGames;
exports.joinGame = joinGame;
exports.deleteGame = deleteGame;
exports.isDrawerInLobby = isDrawerInLobby;
exports.getAllGames = getAllGames;
exports.isPartOfLobbyNotFinished = isPartOfLobbyNotFinished;
exports.leaveLobby = leaveLobby;
exports.deleteGameAndFetchUpdatedOnes = deleteGameAndFetchUpdatedOnes;