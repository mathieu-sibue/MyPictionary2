const mongoose = require("mongoose");
/*
const passwordHash = require("password-hash");
const jwt = require("jwt-simple");
const config = require("../config/config");
*/

const userSchema = mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},           //les passwords sont directement encryptés
    admin: Boolean,
    gamesCreated: Array       //array avec que des IDs de parties CHAMP INUTILE EN REALITE car on peut utiliser le champ "creator" du game considéré
  }
);

module.exports = mongoose.model("User", userSchema);