//Import du package Express
const express = require('express');

//Création d'une application Express
const app = express();

//Récupération de la connexion avec la base de données MySQL gbreak
const connexion = require('./connect');

//Se connecter à la base de données
connexion.connect(function(error){
    if(error){
        return console.error('error : ' + error.message);
    }
    console.log('Connecté au serveur MySQL.');
});

//Se déconnecter à la base de données
connexion.end(function(error){
    if(error){
        return console.error('error : ' + error.message);
    }
    console.log('Déconnecté du serveur MySQL.');
});
