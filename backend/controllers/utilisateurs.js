/**
 * Cette constante permet de récupérer les informations de connexion à la base de données.
 */
const connexion = require("../connect");
/**
 * Cette constante permet de récupérer l'outil uuid 
 * afin de générer un identifiant unique 
 * pour chaque utilisateur.
 */
const { v4: uuidV4 } = require("uuid");
/**
 * Import du package de chiffrement bcrypt 
 * pour chiffrer et créer un hash des mots de passe utilisateur
 */
const bcrypt = require("bcrypt");
/**
 * Import du package jsonwebtoken pour créer un token d'identification 
 * pour chaque utilisateur connecté
 */
const jwt = require('jsonwebtoken');

/**
 * Cette fonction permet de connecter un utilisateur en vérifiant son email et son mot de passe.
 * @param {*} req La requête reçue
 * @requires objet - { email, mot_passe }
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { uuid_util, nom, prenom, date_naiss, email, moderateur, token, expiresIn }
 * ou un objet : { erreur: texte de l'erreur }
 */
exports.connectUser = function(req, res){
    const email = req.body.email;
    const mot_passe = req.body.mot_passe;
    const sqlIfUserExists = "SELECT * FROM Utilisateur WHERE email=?";
    connexion.query(sqlIfUserExists, [email], function(err, rows, fields){
        if(err){
            res.status(500).json({ erreur: "La requête connectUser-sqlIfUserExists est incorrecte !" });
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
                res.status(500).json({ erreur: "connectUser - L'authentification a échouée ! " + error });
            });
        }else{
            res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
        }
    });
};

//Implémentation du CRUD--------------------------------------------------------------------------

//CREATE------------------------------------------------------------------------------------------

//Requête pour créer un utilisateur : fonctionne
/**
 * Cette fonction permet de créer un utilisateur.
 * @param {*} req La requête reçue
 * @requires objet - { nom, prenom, date_naiss, email, mot_passe }
 * @default moderateur=0
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { uuidUtil, prenom, moderateur, token, expiresIn }
 * ou un objet : { erreur: texte de l'erreur }
 */
exports.createUser = function (req, res) {
    const values = req.body;
    const uuidUtil = uuidV4();
    let mdp = "";
    let email = null;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (values.email.match(regex)) {
        email = values.email;
    }
    const sqlIfUserExists = 
        "SELECT * FROM Utilisateur WHERE nom=? AND prenom=? AND date_naiss=? OR email=?";
    const sqlCreerUser = 
        "INSERT INTO Utilisateur " +
        "(uuid_util, email, nom, prenom, date_naiss, mot_passe, moderateur) " +
        "VALUES (?,?,?,?,?,?,?)";
    connexion.query(
        sqlIfUserExists, 
        [values.nom, values.prenom, values.date_naiss, email], 
        function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête createUser-sqlIfUserExists est incorrecte !" });
            } else if (rows.length === 0) {
                if (email != null && values.nom != null && values.prenom != null 
                    && values.date_naiss != null && values.mot_passe != null 
                    && values.moderateur === 0) {
                    bcrypt.hash(values.mot_passe, 10)
                        .then(function (hash) {
                            mdp = hash;
                            connexion.query(
                                sqlCreerUser, 
                                [
                                    uuidUtil, 
                                    email, 
                                    values.nom, 
                                    values.prenom, 
                                    values.date_naiss, 
                                    mdp, 
                                    values.moderateur
                                ], 
                                function (err, rows, fields) {
                                    if (err) {
                                        res.status(500).json({ erreur: "La requête creerUser est incorrecte !" });
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
                            res.status(500).json({ erreur: error });
                        });
                } else {
                    res.status(500).json({ erreur: "Les informations de l'utilisateur sont incorrectes !" });
                }
            } else {
                return res.status(500).json({ erreur: "L'utilisateur ou l'adresse mail existe déjà !" });
            }
        }
    );
};

//READ--------------------------------------------------------------------------------------------

/**
 * Cette fonction permet :
 * - d'obtenir la liste des utilisateurs enregistrés dans la base de données ;
 * - excepté l'utilisateur lambda dit "utilisateur supprimé" ;
 * - excepté le modérateur ;
 * - les classe par ordre alphabétique sur le nom de famille.
 * @param {*} req La requête reçue
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { nom, prenom, date_naiss, email }
 * ou un objet : { erreur : texte de l'erreur }
 */
exports.getAllUsers = function (req, res) {
    const sql = 
        "SELECT uuid_util, nom, prenom, date_naiss, email " +
        "FROM Utilisateur " +
        "WHERE id_util != 0 AND id_util != 1 "+
        "ORDER BY nom";
    connexion.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "getAllUsers - La requête est incorrecte !" });
        }
        res.status(200).json(rows);
    });
};

/**
 * Cette fonction permet d'obtenir les informations d'un utilisateur à l'aide de son uuid.
 * @param {*} req La requête reçue
 * @requires uuid_utilisateur
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { uuid_util, nom, prenom, date_naiss, moderateur, email, mot_passe }
 * ou un objet : { erreur : texte de l'erreur }
 */
exports.getOneUser = function (req, res) {
    const uuidUtil = req.params.id;
    const sql = 
        "SELECT uuid_util, nom, prenom, date_naiss, moderateur, email, mot_passe " +
        "FROM Utilisateur " +
        "WHERE uuid_util=?";
    /**
     * Cette variable permet de :
     * - savoir si l'utilisateur existe
     * - vérifier si l'utilisateur connecté est le même pour qui il demande les informations
     */
    let result = 0;
    connexion.query(sql, [uuidUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "getOneUser - La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_util;
                if (result == uuidUtil) {
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur: "getOneUser - L'utilisateur n'existe pas !" });
            }
        }
    });
};

//DELETE------------------------------------------------------------------------------------------

/**
 * Cette fonction permet de supprimer un utilisateur à l'aide de son uuid.
 * @param {*} req La requête reçue
 * @requires uuid_util
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet { message : "deleteOneUser - L'utilisateur a été supprimé !" }
 * ou un objet { erreur : texte de l'erreur }.
 */
exports.deleteOneUser = function (req, res, next) {
    const uuidUtil = req.params.id;
    /**
     * Cette variable permet de récupérer l'uuid de l'utilisateur lambda
     * dit "utilisateur supprimé" afin de modifier cette information
     * sur les articles et/ou les commentaires
     */
    let uuidLambda ;
    /**
     * Cette variable permet de vérifier si l'utilisateur à supprimer existe.
     */
    let idUtil = 0;
    const sqlRecupInfosLambda = "SELECT * FROM Utilisateur WHERE id_util=?";
    const sqlRecupInfosUtil = "SELECT id_util FROM Utilisateur WHERE uuid_util=?";
    const sqlModifIdUtilArticles = "UPDATE Article SET id_util=?, uuid_util=? WHERE id_util=?";
    const sqlModifIdUtilCommentaires = "UPDATE Commentaire SET id_util=?, uuid_util=? WHERE id_util=?";
    const sqlSupprimerUtil = "DELETE FROM Utilisateur WHERE id_util=?";
    connexion.query(sqlRecupInfosLambda, [0], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête deleteOneUser-RecupInfosLambda est incorrecte !" });
        } else {
            uuidLambda = rows[0].uuid_util;
        }
    });
    connexion.query(sqlRecupInfosUtil, [uuidUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête deleteOneUser-RecupInfosUtil est incorrecte !" });
        } else {
            try {
                idUtil = rows[0].id_util;
                connexion.query(
                    sqlModifIdUtilArticles, [0, uuidLambda, idUtil], 
                    function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ 
                                erreur: "La requête deleteOneUser-modifIdUtilArticles est incorrecte !" 
                            });
                        }
                    }
                );
                connexion.query(
                    sqlModifIdUtilCommentaires, [0, uuidLambda, idUtil], 
                    function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ 
                                erreur: "La requête deleteOneUser-ModifIdUtilCommentaires est incorrecte !" 
                            });
                        }
                    }
                );
                connexion.query(sqlSupprimerUtil, [idUtil], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête deleteOneUser-SupprimerUtil est incorrecte !" });
                    } else {
                        res.status(200).json({ message: "deleteOneUser - L'utilisateur a été supprimé !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "deleteOneUser - L'utilisateur n'existe pas !" });
            }
        }
    });
};