/**
 * Import de MySQL
 */
const mysql = require('mysql');

//require('dotenv').config();

/**
 * Création d'une connexion avec la base de données MySQL
 */
const connexion = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "gbreak"
});

/**
 * Export de la connexion
 */
module.exports = connexion;