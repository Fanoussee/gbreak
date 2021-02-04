//Import du package Express
const express = require('express');

//Création d'une application Express
const app = express();

//Import du package body-parser
const bodyParser = require('body-parser');

const path = require('path');

//Résoud les erreurs de CORS
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//Utilisation de body-parser pour l'app
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

const routesUtilisateurs = require("./routes/utilisateurs");
app.use("/api/utilisateurs", routesUtilisateurs);

const routesArticles = require("./routes/articles");
app.use("/api/articles", routesArticles);

const routesCommentaires = require("./routes/commentaires");
app.use("/api/commentaires", routesCommentaires);

//Se déconnecter à la base de données
/*connexion.end(function(error){
    if(error){
        return console.error('error : ' + error.message);
    }
    console.log('Déconnecté du serveur MySQL.');
});*/

module.exports = app;