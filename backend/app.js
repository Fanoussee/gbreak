//Import du package Express
const express = require('express');

//Création d'une application Express
const app = express();

//Récupération de la connexion avec la base de données MySQL gbreak
const connexion = require('./connect');

//Import du package body-parser
const bodyParser = require('body-parser');

//Résoud les erreurs de CORS
app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin",  "*" ) ;
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization") ;
    res.setHeader("Access-Control-Allow-Methods" , "GET, POST, PUT, DELETE, PATCH, OPTIONS") ;
    next() ;
}) ;

//Utilisation de body-parser pour l'app
app.use(bodyParser.json());

//Se connecter à la base de données
connexion.connect(function(error){
    if(error){
        return console.error('error : ' + error.message);
    }
    console.log('Connecté au serveur MySQL.');
});

//Requête pour obtenir tous les utilisateurs
app.get("/api/utilisateurs", function(req, res){
    const sql = 'SELECT * FROM Utilisateur';
    connexion.query(sql, function(err, rows, fields){
        if(err){
            res.status(500).json({ error : err.message });
        }
        res.json(rows);
    });
});

//Requête pour obtenir un utilisateur
app.get("/api/utilisateurs/:id", function(req, res){
    const sql = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const idUtil = req.params.id;
    connexion.query(sql, [idUtil], function(err, rows, fields){
        if(err){
            res.status(500).json({ error : err.message });
        }
        res.json(rows);
    });
});

//Se déconnecter à la base de données
/*connexion.end(function(error){
    if(error){
        return console.error('error : ' + error.message);
    }
    console.log('Déconnecté du serveur MySQL.');
});*/

module.exports = app;