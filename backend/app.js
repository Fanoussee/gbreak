//Import du package Express
const express = require('express');

//Création d'une application Express
const app = express();

//Récupération de la connexion avec la base de données MySQL gbreak
const connexion = require('./connect');

//Import du package body-parser
const bodyParser = require('body-parser');

//Résoud les erreurs de CORS
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//Utilisation de body-parser pour l'app
app.use(bodyParser.json());

//Se connecter à la base de données
connexion.connect(function (error) {
    if (error) {
        return console.error('error : ' + error.message);
    }
    console.log('Connecté au serveur MySQL.');
});

//Requête pour obtenir tous les utilisateurs
app.get("/api/utilisateurs", function (req, res) {
    const sql = 'SELECT * FROM Utilisateur';
    connexion.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        }
        res.status(200).json(rows);
    });
});

//Requête pour obtenir un utilisateur
app.get("/api/utilisateurs/:id", function (req, res) {
    const sql = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const idUtil = req.params.id;
    let result = 0;
    connexion.query(sql, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].id_util;
                if (result == idUtil) {
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
});

//Requête pour supprimer un utilisateur
app.delete("/api/utilisateurs/:id", function (req, res) {
    const idUtil = req.params.id;
    const sql1 = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const sql2 = 'DELETE FROM Utilisateur WHERE id_util=?';
    let idUserToDelete = 0;
    connexion.query(sql1, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                idUserToDelete = rows[0].id_util;
                if (idUserToDelete == idUtil) {
                    connexion.query(sql2, [idUtil], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "Utilisateur supprimé !" });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
});

//Requête pour modifier un utilisateur
app.put("/api/utilisateurs/:id", function (req, res) {
    const idUtil = req.params.id;
    const sql1 = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const sql2 = 'UPDATE Utilisateur SET ? WHERE id_util=?';
    const values = req.body;
    let idUserToModify = 0;
    connexion.query(sql1, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La 1ère requête est incorrecte !" });
        } else {
            try {
                idUserToModify = rows[0].id_util;
                if (idUserToModify == idUtil) {
                    connexion.query(sql2, [values, idUtil], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La 2e requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "Utilisateur modifié !" });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
});

//Requête pour créer un utilisateur
app.post("/api/utilisateurs", function (req, res) {
    const values = req.body;
    const sql1 = 'SELECT id_util FROM Utilisateur WHERE nom=? AND prenom=? AND date_naiss=?';
    const sql2 = 'INSERT INTO Utilisateur (nom, prenom, date_naiss, mot_passe, moderateur) VALUES (?,?,?,?,?)';
    connexion.query(sql1, [values.nom, values.prenom, values.date_naiss], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La 1ere requête est incorrecte !" });
        } else {
            try {
                if (rows[0].id_util > 0) {
                    res.status(500).json({ erreur: "L'utilisateur existe déjà !" });
                }
            } catch (error) {
                connexion.query(sql2,
                    [values.nom, values.prenom, values.date_naiss, values.mot_passe, values.moderateur],
                    function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La 2e requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "Utilisateur créé !" });
                        }
                    });
            }
        }
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