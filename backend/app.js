/**
 * Import du framework Express
 */
const express = require('express');
/**
 * Création d'une application Express
 */
const app = express();
/**
 * Import du package body-parser
 */
const bodyParser = require('body-parser');
/**
 * Import du path de Node
 */
const path = require('path');
/**
 * Import du router des utilisateurs
 */
const routesUtilisateurs = require("./routes/utilisateurs");
/**
 * Import du router des articles
 */
const routesArticles = require("./routes/articles");
/**
 * Import du router des commentaires
 */
const routesCommentaires = require("./routes/commentaires");

/**
 * Ce middleware gère les erreurs de CORS : Cross Origin Resource Sharing.
 * Il résoud les problèmes de communication entre des serveurs
 * différents comme le port serveur (3000) et le port de l'application (4200)
 */
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
/**
 * Utilisation de body-parser pour l'app
 */
app.use(bodyParser.json());
/**
 * Service du dossier images pour les récupérer
 */
app.use('/images', express.static(path.join(__dirname, 'images')));
/**
 * Service du router pour toutes les requêtes
 * ayant l'endpoint api/utilisateurs
 */
app.use("/api/utilisateurs", routesUtilisateurs);
/**
 * Service du router pour toutes les requêtes
 * ayant l'endpoint api/articles
 */
app.use("/api/articles", routesArticles);
/**
 * Service du router pour toutes les requêtes
 * ayant l'endpoint api/commentaires
 */
app.use("/api/commentaires", routesCommentaires);

/**
 * Export de l'application Express
 */
module.exports = app;