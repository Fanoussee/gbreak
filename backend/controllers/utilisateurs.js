const connexion = require("../connect");
const { v4: uuidV4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//Requête pour connecter un utilisateur : fonctionne
exports.connectUser = function(req, res){
    const email = req.body.email;
    const mot_passe = req.body.mot_passe;
    const sqlIfUserExist = 'SELECT * FROM Utilisateur WHERE email=?';
    connexion.query(sqlIfUserExist, [email], function(err, rows, fields){
        if(err){
            res.status(500).json({ erreur: "La requête sqlIfExist est incorrecte !" });
        }else if(rows.length === 1){
            bcrypt.compare(mot_passe, rows[0].mot_passe).then(valid => {
                if(!valid){
                    res.status(500).json({ erreur: "Le mot de passe est incorrect !" });
                }else{
                    const payload = { subject: rows[0].uuid_util };
                    const expiresIn = '24h';
                    const token = jwt.sign(payload, 'RANDOM_TOKEN_SECRET', { expiresIn });
                    res.status(200).json({ 
                        uuid_util: rows[0].uuid_util,
                        nom: rows[0].nom,
                        prenom: rows[0].prenom,
                        date_naiss: rows[0].date_naiss,
                        email,
                        moderateur : rows[0].moderateur,
                        token,
                        expiresIn
                    });
                    
                }
            }).catch(error => {
                res.status(500).json({ erreur: "L'authentification a échouée ! " + error });
            });
        }else{
            res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
        }
    });
};

//Requête pour créer un utilisateur : fonctionne
exports.createUser = function (req, res) {
    const values = req.body;
    const sqlIfUserExist = 'SELECT * FROM Utilisateur WHERE nom=? AND prenom=? AND date_naiss=? OR email=?';
    const sqlCreerUser = 'INSERT INTO Utilisateur (uuid_util, email, nom, prenom, date_naiss, mot_passe, moderateur) VALUES (?,?,?,?,?,?,?)';
    const uuidUtil = uuidV4();
    let mdp = "";
    let email = null;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (values.email.match(regex)) {
        email = values.email;
    }
    connexion.query(sqlIfUserExist, [values.nom, values.prenom, values.date_naiss, email], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête sqlIfExist est incorrecte !" });
        } else if (rows.length == 0) {
            if (email != null && values.nom != null && values.prenom != null && values.date_naiss != null &&
                values.mot_passe != null && (values.moderateur == 0 || values.moderateur == 1)) {
                bcrypt.hash(values.mot_passe, 10)
                    .then(function (hash) {
                        mdp = hash;
                        connexion.query(sqlCreerUser, [uuidUtil, email, values.nom, values.prenom, values.date_naiss,
                            mdp, values.moderateur], function (err, rows, fields) {
                                if (err) {
                                    res.status(500).json({
                                        erreur: "La requête creerUser est incorrecte !",
                                        mysql: err
                                    });
                                } else {
                                    const payload = { subject: uuidUtil };
                                    const expiresIn = '24h';
                                    const token = jwt.sign(payload, 'RANDOM_TOKEN_SECRET', { expiresIn });
                                    res.status(201).json({  
                                        uuid_util: uuidUtil,
                                        prenom: values.prenom,
                                        moderateur : values.moderateur,
                                        token,
                                        expiresIn
                                    });
                                }
                            });
                    })
                    .catch(function (error) {
                        res.status(500).json({ error });
                    });
            } else {
                res.status(500).json({ erreur: "Les informations de l'utilisateur sont incorrectes !" });
            }
        } else {
            return res.status(500).json({ erreur: "L'utilisateur ou l'adresse mail existe déjà !" });
        }
    });
};

//Requête pour obtenir tous les utilisateurs : fonctionne
exports.getAllUsers = function (req, res) {
    const sql = 'SELECT * FROM Utilisateur WHERE id_util != 0 AND id_util != 1 ORDER BY nom';
    
    connexion.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        }
        res.status(200).json(rows);
    });
};

//Requête pour obtenir un utilisateur : fonctionne
exports.getOneUser = function (req, res) {
    const sql = 'SELECT uuid_util, nom, prenom, date_naiss, moderateur, email, mot_passe FROM Utilisateur WHERE uuid_util=?';
    const uuidUtil = req.params.id;
    let result = 0;
    connexion.query(sql, [uuidUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_util;
                if (result == uuidUtil) {
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
};

//Requête pour modifier un utilisateur : fonctionne
exports.modifyOneUser = function (req, res) {
    const uuidUtil = req.params.id;
    console.log(uuidUtil);
    const sql1 = 'SELECT * FROM Utilisateur WHERE uuid_util=?';
    const sql2 = 'UPDATE Utilisateur SET ? WHERE uuid_util=?';
    let idUserToModify = 0;
    const values = req.body;
    console.log(values);
    connexion.query(sql1, [uuidUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                idUserToModify = rows[0].uuid_util;
                if (idUserToModify == uuidUtil) {
                    bcrypt.hash(values.mot_passe, 10)
                        .then(function (hash) {
                            values.mot_passe = hash;
                            connexion.query(sql2, [values, uuidUtil], function (err, rows, fields) {
                                if (err) {
                                    res.status(500).json({ erreur: "La requête est incorrecte !" });
                                } else {
                                    res.status(200).json({ message: "Utilisateur modifié !" });
                                }
                            });
                        }).catch(function (error) {
                            res.status(500).json({ erreur: error });
                        });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
};

//Requête pour supprimer un utilisateur : fonctionne
exports.deleteOneUser = function (req, res, next) {
    //uuid_util dans req.params
    const uuidUtil = req.params.id;
    //uuid_util de l'utilisateur supprimé
    let uuidLambda = "";
    //id_util à récupérer dans une requête
    let idUtil = 0;
    const sqlRecupInfosLambda = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const sqlRecupInfosUtil = 'SELECT * FROM Utilisateur WHERE uuid_util=?';
    const sqlModifIdUtilArticles = 'UPDATE Article SET id_util=?, uuid_util=? WHERE id_util=?';
    const sqlModifIdUtilCommentaires = 'UPDATE Commentaire SET id_util=?, uuid_util=? WHERE id_util=?';
    const sqlSupprimerUtil = 'DELETE FROM Utilisateur WHERE id_util=?';
    connexion.query(sqlRecupInfosLambda, [0], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            uuidLambda = rows[0].uuid_util;
        }
    });
    connexion.query(sqlRecupInfosUtil, [uuidUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête recupInfosUtil est incorrecte !" });
        } else {
            try {
                idUtil = rows[0].id_util;
                connexion.query(sqlModifIdUtilArticles, [0, uuidLambda, idUtil], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête modifIdUtilArticles est incorrecte !" });
                    }
                });
                connexion.query(sqlModifIdUtilCommentaires, [0, uuidLambda, idUtil], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: err });
                    }
                });
                connexion.query(sqlSupprimerUtil, [idUtil], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête supprimerUtil est incorrecte !" });
                    } else {
                        res.status(200).json({ message: "L'utilisateur a été supprimé !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });

};