const connexion = require('../connect');
const { v4: uuidV4 } = require('uuid');

//Requête pour obtenir tous les commentaires :
exports.getAllComments = function (req, res) {
    const sql = "SELECT * FROM Commentaire";
    let result ;
    connexion.query(sql, function(err, rows, fields){
        if(err){
            res.status(500).json({ erreur: err.sqlMessage });
        }else{
            try {
                result = rows;
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ message : "Il n'y a aucun commentaire !" });
            }
        }
    });
}

//Requête pour obtenir tous les commentaires d'un article : fonctionne
exports.getAllCommentsByIdArticle = function (req, res) {
    const uuidArticle = req.params.idArticle;
    const sql1 = 'SELECT * FROM Article WHERE uuid_Article=?';
    const sql2 = "SELECT Commentaire.uuid_util, nom, prenom, date_commentaire, commentaire, Commentaire.uuid_article "
        + "FROM Utilisateur, Commentaire "
        + "WHERE Commentaire.uuid_util = Utilisateur.uuid_util AND Commentaire.uuid_article=? "
        + "ORDER BY date_commentaire";
    let result ;
    connexion.query(sql1, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_article;
                connexion.query(sql2, [uuidArticle], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête est incorrecte !" });
                    } else if (rows.length == 0) {
                        res.status(200).json([]);
                    } else {
                        res.status(200).json(rows);
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "L'article n'existe pas !" });
            }
        }
    });
}

//Requête pour créer un commentaire sur un article : fonctionne
exports.createComment = function (req, res) {
    let idUtil = 0;
    let idArticle = 0;
    const dateCreation = new Date();
    const commentaire = req.body.commentaire;
    const uuidUtil = req.body.uuid_util;
    const uuidArticle = req.params.idArticle;
    const uuidComment = uuidV4();
    const sqlRecupIdUtil = 'SELECT * FROM Utilisateur WHERE uuid_util=?';
    const sqlRecupInfosArticle = 'SELECT * FROM Article WHERE uuid_article=?';
    const sqlCreationCommentaire = "INSERT INTO Commentaire "
        + "(id_util, id_article, date_commentaire, commentaire, uuid_util, "
        + "uuid_article, uuid_commentaire) VALUES (?,?,?,?,?,?,?)";

    if (uuidUtil != null && commentaire != null) {
        connexion.query(sqlRecupIdUtil, [uuidUtil], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête recupIdUtil est incorrecte !" });
            } else {
                try {
                    idUtil = rows[0].id_util;
                    connexion.query(sqlRecupInfosArticle, [uuidArticle], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La requête recupInfosArticle est incorrecte !" });
                        } else {
                            try {
                                idArticle = rows[0].id_article;
                                connexion.query(sqlCreationCommentaire, [idUtil, idArticle, dateCreation, commentaire, uuidUtil, uuidArticle, uuidComment], function (err, rows, fields) {
                                    if (err) {
                                        res.status(500).json({ erreur: err.sqlMessage });
                                    }else{
                                        res.status(201).json({ message: "Le commentaire a été ajouté à l'article !" });
                                    }
                                });
                            } catch (error) {
                                res.status(500).json({ erreur: "L'article n'existe pas !" });
                            }
                        }
                    });
                } catch (error) {
                    res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
                }
            }
        });
    } else {
        res.status(500).json({ erreur: "Les données sont incorrectes !" });
    }
}

//Requête pour modifier un commentaire : fonctionne
exports.modifyComment = function (req, res) {
    const uuidCommentaire = req.params.idCommentaire;
    let idCommentaire = 0;
    const values = req.body;
    const sqlIfCommentExist = 'SELECT * FROM Commentaire WHERE uuid_commentaire=?';
    const sqlModifyComment = 'UPDATE Commentaire SET ? WHERE id_commentaire=?';
    connexion.query(sqlIfCommentExist, [uuidCommentaire], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                idCommentaire = rows[0].id_commentaire;
                connexion.query(sqlModifyComment, [values, idCommentaire], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête est incorrecte !" });
                    } else {
                        res.status(200).json({ message: "Le commentaire a été modifié !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "Le commentaire n'existe pas !" });
            }
        }
    });
}

//Requête pour supprimer un commentaire : 
exports.deleteComment = function (req, res) {
    const uuidCommentaire = req.params.idCommentaire;
    let uuidArticle = "";
    let idCommentaire = 0;
    const sqlIfCommentExist = 'SELECT * FROM Commentaire WHERE uuid_commentaire=?';
    const sqlDeleteComment = 'DELETE FROM Commentaire WHERE id_commentaire=?';
    connexion.query(sqlIfCommentExist, [uuidCommentaire], function (err, rows, fields) {
        if (err) {
            res.status(500).json({
                erreur: "La requête ifCommentExist est incorrecte !",
                message: err
            });
        } else {
            try {
                idCommentaire = rows[0].id_commentaire;
                uuidArticle = rows[0].uuid_article;
                connexion.query(sqlDeleteComment, [idCommentaire], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({
                            erreur: "La requête est incorrecte !",
                            message: err
                        });
                    } else {
                        res.status(200).json({ message: "Le commentaire a été supprimé !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "Le commentaire n'existe pas !" });
            }
        }
    });
}