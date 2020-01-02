import axios from "axios";
var headers = {
    'Content-Type': 'application/json'
};
const burl = 'http://localhost:8800'    //basic url à laquelle on va append la suite des routes ; on s'adresse au serveur qui écoute sur la boucle interne 8800


export default {
    login: function (email, password) {
        return axios.post(`${burl}/user/login`, {
            email, password
        },
        {
            headers: headers
        }
        ).then(res => res)
    },

    signup: function (send) {
        return axios.post(`${burl}/user/signup`, 
        send, 
        { 
            headers: headers
        }
        ).then(res => res)
    },

    isAuth: function () {
        return localStorage.getItem("token") !== null;      //appel au storage local du navigateur client pour voir si il y a bien un token d'auth JWT 
        //si une simple chaine de caractère de même longueur a été rentrée dans le local storage, le user pourra avoir accès aux pages d'un user auth, MAIS il n'y aura aucune ressource dessus grâce à Passport
    },

    isAdmin: function() {
        return JSON.parse(localStorage.getItem("userInfo")).admin;      //même remarque qu'au dessus si un user modifie son local storage
    },

    isAuthBackCheck: function () {
        var token = localStorage.getItem("token");
        if (token !== null) {
            return axios.get(`${burl}/user/isauth`, {
                headers: headers,
                params: token
            }
            ).then(res => res.data.isAuth)
        } else {
            return false
        }
    },

    isAdminBackCheck: function () {
        var token = localStorage.getItem("token");
        if (token !== null) {
            return axios.get(`${burl}/user/isadmin`, {
                headers: headers,
                params: token
            }
            ).then(res => res.data.isAdmin)
        } else {
            return false
        }
    },

    logout: function () {
        localStorage.clear();               //on vide le local storage
    },

    sendModifiedWord: function (id, word, description) {
        return axios.post(`${burl}/word/modify`, {
            id, word, description
        }, 
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        );
    },

    sendModifiedWordAndFetchOthers: function (id, word, description) {
        return axios.post(`${burl}/word/modifyandfetch`, {
            id, word, description
        }, 
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.words);
    }, 

    getWords: async function () {
        return axios.get(`${burl}/word/getall`, {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.wordList)
    },

    createWord: function (author, word, description) {
        return axios.post(`${burl}/word/create`, {
            author, word, description
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        );
    },
    /*  //dépréciée
    deleteWord: function (wordId) {
        return axios.post(`${burl}/word/delete`, {
            wordId
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        );
    },
    */
    deleteWordAndFetchOthers: function (wordId) {
        return axios.post(`${burl}/word/deleteandfetch`, {
            wordId
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.words);
    },

    createGame: function (lobbyName, roundNb, maxNbParticipants, creatorId) {
        return axios.post(`${burl}/game/create`, {
            lobbyName, roundNb, maxNbParticipants, creatorId
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.createdGameId)
    },

    getGames: async function (getFinishedGames) {           //l'argument vaudra toujours false au final... argument déprécié
        return axios.get(`${burl}/game/getall`, {
            params: { isFinished: getFinishedGames },
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.gameList)
    },

    getAllGames: async function () {
        return axios.get(`${burl}/game/getallnocondition`, {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.gameList)       
    },

    getCreatedGames: async function (userId) {
        return axios.get(`${burl}/game/getcreatedby`, {
            params: { creator: userId },
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }            
        }
        ).then(res => res.data.gameList)
    },

    joinGame: function (gameId, joiningPlayerId, joiningPlayerUsername) {
        return axios.post(`${burl}/game/join`, {
            gameId, joiningPlayerId, joiningPlayerUsername
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        )
    },
    /* //dépréciée
    deleteGame: function (gameId) {
        return axios.post(`${burl}/game/delete`, {
            gameId
        }, 
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        )
    },
    */
    deleteGameAndFetchUpdatedOnes: function (gameId) {
        return axios.post(`${burl}/game/deleteandfetch`, {
            gameId
        }, 
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.games)
    },

    getUsernames: function (idList) {
        return axios.get(`${burl}/user/getusernames`, {
            params: { idList: idList },
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }            
        }
        ).then(res => res.data.usernames)        
    },

    isDrawerInLobby: function (userId, lobbyId) {
        return axios.get(`${burl}/game/isdrawer`, {
            params: { userId: userId, lobbyId: lobbyId },
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }            
        }
        ).then(res => res.data.isDrawer) 
    },

    isUserInGameOrGameUnfinished: function (userId, lobbyId) {
        return axios.get(`${burl}/game/ispartoflobby`, {
            params: { userId: userId, lobbyId: lobbyId },
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }            
        }
        ).then(res => res.data.isPartOfLobbyNotFinished) 
    },

    leaveLobby: function (userId, lobbyId, isCreatorOfGame) {
        return axios.post(`${burl}/game/leavelobby`, {
            userId, lobbyId, isCreatorOfGame
        }, 
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        )
    }
};