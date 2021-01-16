//Import de MySQL
const mysql = require('mysql');

//Créatin d'une connexion avec la base de données MySQL
const connexion = mysql.createConnection({
    host: 'localhost',
    user: 'employe',
    password: 'employe',
    database: 'gbreak'
});

//Export de la connexion
module.exports = connexion;