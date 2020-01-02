# MyPictionary2 par Mathieu Sibué

## Description

MyPictionary est un site qui permet de jouer au jeu Pictionary en ligne, intégrant un système de comptes utilisateurs. 

Seuls les utilisateurs authentifiés peuvent créer un lobby de jeu ou en rejoindre un. Le créateur de la partie est le dessinateur pour l'ensemble des manches ; les autres participants doivent deviner les objets dessinés par le créateur de la partie.

Le mot à représenter par le créateur du lobby à chaque manque apparaît sur sa fenêtre avec une brève description au début de chaque manche. Les mots à dessiner sont déternminés aléatoirement à partir d'une collection.


## Description technique

Ce projet est composé :
- d'un backend utilisant le framework JS Express (Node), le package passport pour l'authentification par JWT et communiquant avec une base de donnée MongoDB gérée via mongoose
- d'un frontend utilisant le framework JS React, react-bootstrap pour l'apparence du site, axios pour formuler des requêtes HTTP vers le backend et socket.io pour la communication en temps réel avec le backend.


## Installation

### Prérequis techniques

Pour faire fonctionner le projet, il vous faut :
- maîtriser Git
- une version récente de Node (v12.0.0)
- le gestionnaire de paquets npm (v6.12.1) pour installer les dépendances du backend et yarn (v1.19.2) pour celles du frontend
- une instance locale de MongoDB tournant sur le port 27017
- une version récente de ReactJS (v16.12.0) pour le frontend
- une version récente de axios (v0.18.0) pour effectuer les requêtes HTTP du frontend vers le backend
- une version récente de socket.io (v2.3.0) pour la communication en temps réel entre frontend et backend.


### Mise en route

Installez les versions spécifiées de Node, MongoDB, npm et yarn si nécessaire.

Pour installer la partie backend du projet (qui se trouve dans le dossier "backend" à la racine du projet), lancez la commande :
```bash
npm install
```
depuis la console dans le répertoire ./backend

Pour installer la partie frontend du projet (qui se trouve dans le dossier "client" à la racine du projet), lancez la commande :
```bash
yarn install
```
depuis la console dans le répertoire ./client

Créez une base de données nommée "MyPictionary2" sur votre instance de MongoDB locale.

Sur deux terminaux différents (de votre IDE par exemple), lancez depuis la racine du projet :
```bash
cd backend
node server.js (ou npm start ou nodemon server.js si vous souhaitez debugger)
```
pour mettre en route le serveur du backend et :
```bash
cd client
yarn start
```
pour mettre en route le frontend.

Une fois l'application lancée, vous pouvez désormais vous créer un compte utilisateur depuis l'onglet "Sign Up" de la barre de navigation. 
Si vous souhaitez créer un compte admin, il vous faudra créer un simple compte utilisateur puis modifier directement le document créé dans la collection "users" de la DB "MyPictionary2" à l'aide de Robo 3T par exemple (un compte admin est déjà à disposition dans les collections à importer). Un compte utilisateur ne peut être créé autrement pour des raisons de sécurité.


### Chargement des collections de la base de donnée

- Dans le terminal de l'IDE ou de windows, se placer dans le dossier d'installation de MongoDB et naviguer vers le dossier bin contenu dans le dossier MongoDB.
- Lancer alors les commandes : "mongoimport --db MyPictionary2 --file <chemin d'accès à MyPictionary2>\database_to_import\<users OU games OU words OU scores>.json" pour importer les documents de chaque collection que j'avais créés lors du développement du site web. Faire ceci pour chacune des quatre collections "users", "games", "scores" et "words".
- Visualisation des données de la base de données : à l'aide de Robo3T (connexion au "localhost:27017")
 
Vous pourrez ensuite vous connecter à 5 comptes utilisateurs pré-existants (email : userN@gmail.com où N est compris entre 1 et 5, mdp : userN où N est compris entre 1 et 5) et un compte admin (email : admin@gmail.com, mdp : admin). Une partie crée par user2 est en cours et peut encore accueillir des joueurs ("onGoingLobby1"). Une autre est achevée ("niceLobby1").


## Liste des fonctionnalités

- Inscription/connexion des utilisateurs
- Création d'une partie et redirection directe vers le lobby créé
- Possibilité de rejoindre une partie en cours depuis l'écran de visualisation
- Possibilité de quitter une partie en cours et d'y mettre fin si on est le dessinateur
- Visualisation de l'historique des parties créées et désormais finie par l'utilisateur connecté
- Suppression des parties finies si l'utilisateur connecté est un administrateur et visualisation de toutes les parties
- Création, modification et suppression de mots si l'utilisateur connecté est administrateur
- Système de score pour les joueurs "guessers" d'un lobby : le premier à deviner le mot gagne un point et remporte la manche
- Lorsqu’une manche commence, dessiner en temps réel avec sa souris pour le créateur de la partie et visualiser le dessin en temps réel et essayer de deviner le mot en tapant dans un input pour les "guessers"
- Visualisation des scores des autres joueurs "guessers" d'un même lobby


## Remarques concernant l'implémentation technique

- Utiliser l'API de contexte React (ou de Redux) aurait grandement facilité l'utilisation des informations de l'utilisateur pour la génération des pages et leur accès (PrivateRoutes), tout comme la persistance d'un contexte par lobby (il est possible de recharger la page du lobby ou de revenir en arrière puis sur la page du lobby depuis le navigateur sans perdre le "contexte" de la manche ; toutefois le dessin déjà effectué sera perdu).
- L'aspect responsive du canvas lors du dessin (et de sa réception par les "guessers") est questionnable : lorsque la fenêtre du navigateur est redimensionnée, le canvas est effacé (que ce soit côté "guesser" ou dessinateur). Toutefois, si la taille de la fenêtre n'est pas modifiée en cours de partie, le dessin sera bien redimensionné. Le reste des pages est responsive.
- Lorsqu'un "guesser" quitte une partie avant sa fin et qu'il la rejoint à nouveau, son score est détruit (ceci est un choix d'implémentation).
- On ne peut rejoindre une partie qu'en cliquant sur le bouton "join!" depuis l'écran de visualisation (il ne suffit pas uniquement de disposer de l'url de la page du lobby, une Private Route s'assure de la redirection). Ceci est un choix d'implémentation.
- Le créateur de la partie peut y mettre fin en cours ; les scores de chacun seront alors détruits. Ceci est un choix d'implémentation.
- Une information critique est stockée dans le localStorage utilisateur : il s'agit de l'attribut isAdmin de l'utilisateur connecté. Ceci, en plus du token JWT d'authentification, est utilisé pour les Private Routes côté React dans l'app. Bien que n'importe quel user connecté puisse ainsi, en modifiant cet attribut dans son localStorage, accéder aux pages admin, grâce à la vérification de token via passport, le user frauduleux ne pourra pas effectuer d'actions dangereuses vers le back. Faute de temps, je n'ai pas pu implémenter de private route côté react effectuant la même vérification que passport à chaque changement de page. Le plus simple aurait tout de même d'avoir utilisé un contexte utilisateur.
- Le projet a été repris à 0 depuis la première échéance. Vu le peu de temps dont je disposais (et comme la doc et les tutoriels React mettent toujours en avant en priorité l'implémentation par classe des composants), je n'ai pas eu le temps de refactoriser mon projet dans son entièreté avec des composants fonctionnels (hooks, API contexte,...), en dépit de tous les avantages procurés...
- Il manque l'implémentation d'alertes pour l'utilisateur (autres que les erreurs loggées sur la console du navigateur...) notamment pour les forms.
- Penser à "toggler" les Panels react-bootstrap, notamment en phase de jeu !!!
- ES lint a bien été utilisé sur le backend.
