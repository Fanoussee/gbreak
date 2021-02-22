/**
 * Import de MySQL
 */
const mysql = require('mysql');

/**
 * Création d'une connexion avec la base de données MySQL
 */
const connexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

/**
 * Export de la connexion
 */
module.exports = connexion;