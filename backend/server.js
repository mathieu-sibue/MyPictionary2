//Importation des modules
const express = require("express"); 
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const http = require("http");
const DBFetchAndModify = require("./business/singleLobbyDBAction");
const cors = require("cors");


//On se connecte à MongoDB
mongoose.set('useCreateIndex', true);   //Pour éviter d'avoir les Deprecation Warnings
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/MyPictionary2', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//On initialise l'app express du back
const app = express();
const server = http.Server(app);


//Utilisation du middleware Body Parser
const urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedParser);
app.use(bodyParser.json());



//Définition des CORS
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


//Mise en place des routes d'écoute
const userRouter = require("./routes/userRoutes")
app.use("/user", userRouter)

const wordRouter = require("./routes/wordRoutes")
app.use("/word", wordRouter)

const gameRouter = require("./routes/gameRoutes")
app.use("/game", gameRouter)


//Socket.IO
const io = socketIO(server);
io.sockets.on("connection", socket => {

	socket.on("join", async (join) => {         
        //pour récupérer le contexte de la partie (si arrivée en cours de route)
        let lobbyId = join.lobbyId; 

        socket.join(lobbyId);       
        //on rejoint la room d'écoute du lobby
          
        //configuration du socket qui n'a finalement pas été réutilisée...
        socket.username = join.username; 
        socket.userId = join.userId;  

        //état d'avancement du lobby (= contexte de la partie) partagé au socket ayant émis "join" au serveur
        let lobbyInfo = await DBFetchAndModify.getLobbyInfo(lobbyId)            
        socket.emit("joined", lobbyInfo);

        //on envoie à tous les sockets de la room la liste mise à jour des scores (et donc des guessers) dans cette partie
        let currentUsersInLobby = await DBFetchAndModify.getUsersInLobby(lobbyId);          
        io.in(lobbyId).emit("users", currentUsersInLobby);
    });


    socket.on("start", async data => {              
        //le dessinateur déclare le début du round pour tout le monde
        if (data.currentRound === 0) {              
            //s'il s'agit du premier round, on initialise la liste de mots prévue pour la partie
            await DBFetchAndModify.initializeWordList(data.lobbyId)       
        }

        let wordInfoForTheRound;
        if (data.currentRound === data.roundNb) {            
            //pas vraiment nécessaire, au cas où trop de clics enregistrés pour passer au round suivant : il faut éviter d'avoir un currentRound > roundNb    
            await DBFetchAndModify.gameIsFinished(data.lobbyId);            //just in case (on reprend l'event "gameIsFinishedNormally")
            let finalUsersAndScoresInLobby = await DBFetchAndModify.getUsersInLobby(data.lobbyId);
            io.in(data.lobbyId).emit("results", finalUsersAndScoresInLobby);

        } else {            
            //cas habituel où on n'a pas atteint le dernier round
            wordInfoForTheRound = await DBFetchAndModify.getWordInfoForRound(data.lobbyId, data.currentRound)
            await DBFetchAndModify.incrementRoundCount(data.lobbyId);
            await DBFetchAndModify.updateRoundOnGoing(data.lobbyId);
            io.in(data.lobbyId).emit("roundCanStart", wordInfoForTheRound);             
            //on envoie à tous les joueurs les infos relatives au round (mot à deviner,...)          
        }
    });


    socket.on("drawing", (data) => {                
        //permet de retransmettre les coordonnées dessinées par le créateur de la partie à tous les autres joueurs du lobby
		socket.in(data.lobbyId).emit("drawing", data);
    });


	socket.on("clear", (clear) => {                 
        //permet de transmettre une action d'effaçage du canvas lorsque le dessinateur le fait sur le sien
		io.in(clear.lobbyId).emit("cleared", clear);
    });


    socket.on("iHaveWon", async data => {               
        //envoyé depuis un guesser lorsque le mot dans son input est égal au mot à deviner
        //console.log(`${data.username} has won in ${data.lobbyId} lobby!`);
        await DBFetchAndModify.updateScoreOfWinner(data.userId, data.lobbyId);          
        await DBFetchAndModify.updateRoundOnGoing(data.lobbyId);
        await DBFetchAndModify.setPreviousWinner(data.lobbyId, data.username);
        //on met à jour le contexte de la partie suite à la victoire du round (scores, état de la partie,...)

        //on envoie à tous les utilisateurs les scores updatés suite à la victoire
        let currentUsersInLobby = await DBFetchAndModify.getUsersInLobby(data.lobbyId);             
		io.in(data.lobbyId).emit("users", currentUsersInLobby);                 

        //on envoie l'événement annonçant la victoire à tous les joueurs
        io.in(data.lobbyId).emit("aUserHasWon", { winnerName: data.username });
    });


    socket.on("leaveroom", async (data) => {            
        //envoyé depuis un guesser en cours de partie : on détruit son score et on le retire de la liste des participants dans le document du Game
        await DBFetchAndModify.userLeavesLobby(data.lobbyId, data.userId);                  

        //on update le scoreboard des users dans le lobby et envoie les données correspondantes à tous
        let currentUsersInThisLobby = await DBFetchAndModify.getUsersInLobby(data.lobbyId);         
        io.in(data.lobbyId).emit("users", currentUsersInThisLobby);
    });


    socket.on("gameEndedByDrawer", async data => {              
        //envoyé depuis le dessinateur pour mettre fin de façon abrupte au jeu : détruit les scores et set la partie en finished
        await DBFetchAndModify.finishGameAndDeleteScores(data.lobbyId);
        io.in(data.lobbyId).emit("gameHasEnded")
    });


    socket.on("gameIsFinishedNormally", async data => {             
        //envoyé depuis le dessinateur lorsque le dernier round a bien été terminé
        //console.log("game is finished received by srv")
        await DBFetchAndModify.gameIsFinished(data.lobbyId);
        let finalUsersAndScoresInLobby = await DBFetchAndModify.getUsersInLobby(data.lobbyId);
        io.in(data.lobbyId).emit("results", finalUsersAndScoresInLobby);
        //on envoie le scoreboard final à tous les users de la partie
    });
});



//Définition et mise en place du port d'écoute
const port = 8800;
server.listen(port, () => console.log(`App listening on port ${port}`));