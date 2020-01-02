const User = require("../../models/User.js");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");


async function signup(req, res) {
  const { password, email, username } = req.body;
  if (!email || !password || !username) {
    //Le cas où l'email ou bien le password ne serait pas soumis ou nul
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  //Création d'un objet user, dans lequel on hash le mot de passe
  const user = {
    email,
    password: passwordHash.generate(password),
    username: username,
    admin: false,
    gamesCreated: []
  };
  //On check en base si l'utilisateur existe déjà
  try {
    const findUser = await User.findOne({
      email
    });
    if (findUser) {
      return res.status(400).json({
        text: "L'utilisateur existe déjà"
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
  try {
    //Sauvegarde de l'utilisateur en base
    var userData = new User(user);
    const userObject = await userData.save();
    console.log(jwt.sign({ userId: userObject._id }, config.secret))
    return res.status(201).json({
      text: "Succès",
      token: jwt.sign(
        { 
          userId: userObject._id,
        }, 
        config.secret
      ),                    
      userInfo: {
        id: userObject._id, 
        username: userObject.username, 
        admin: userObject.admin,
        email: userObject.email
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error });
  }
}


async function login(req, res) {
  const { password, email } = req.body;
  if (!email || !password) {
    //Le cas où l'email ou bien le password ne serait pas soumit ou nul
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    //On check si l'utilisateur existe en base
    const foundUser = await User.findOne({ email });
    if (!foundUser){
      return res.status(404).json({
        text: "L'utilisateur n'existe pas"
      });
    }
    if (!passwordHash.verify(password, foundUser.password)){
      return res.status(401).json({
        text: "Mot de passe incorrect"
      });
    }
    return res.status(200).json({
      token: jwt.sign(
        { 
          userId: foundUser._id,
        }, 
        config.secret
      ),
      text: "Authentification réussie",
      userInfo: {
        id: foundUser._id, 
        username: foundUser.username,
        email: foundUser.email, 
        admin: foundUser.admin
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error
    });
  }
}


async function getUsernames(req, res) {
  let idList = req.query.idList;
  if (!idList) {
    return res.status(400).json({
      text: "Requête invalide: liste vide"
    });
  }
  try {
    const foundUsers = await User.find({ _id: {$in: idList} });
    const usernameList = foundUsers.map(user => user.username);
    return res.status(200).json({ usernames: usernameList }) 
  } catch (error) {
    return res.status(500).json({ error });
  }
}


//Fonctions non utilisées par manque de temps : étaient censées permettre de vérifier dans le back si le user cherchant à accéder à une page côté front est bien authentifié ou admin
//(à utiliser dans les private routes asynchrones tout comme la PrivateRouteInGame)
/*
async function isAuth(req, res) {
  console.log(req.query)
  let {token} = req.query;
  let userId = jwt.verify(token, config.secret)
  const user = await User.findOne({ _id: userId });
  if (user) {
    return res.status(200).json({ text: "user co", isAuth: true })
  } else {
    return res.status(200).json({ text: "user non co", isAuth: false })
  }
}

async function isAdmin(req, res) {
  console.log(req.query)
  let {token} = req.query;
  let userId = jwt.verify(token, config.secret)
  const user = await User.findOne({ _id: userId });
  if (user && user.admin) {
    return res.status(200).json({ text: "user co", isAdmin: true })
  } else {
    return res.status(200).json({ text: "user non co", isAdmin: false })
  }
}
*/



exports.login = login;
exports.signup = signup;
exports.getUsernames = getUsernames;
/*
exports.isAuth = isAuth;
exports.isAdmin = isAdmin;
*/