const connexion = require('../connect');

//Requête pour obtenir tous les commentaires d'un article : fonctionne
exports.getAllCommentsByIdArticle = function (req, res) {
    const uuidArticle = req.params.idArticle;
    const sql1 = 'SELECT * FROM Article WHERE uuid_Article=?';
    const sql2 = 'SELECT * FROM Commentaire WHERE uuid_Article=?';
    let result = 0;
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
                        res.status(200).json({ message: "Cet article n'a pas de commentaire !" });
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
    let nbCommentaires = 0;
    const dateCreation = new Date();
    const commentaire = req.body.commentaire;
    const uuidUtil = req.body.uuid_util;
    const uuidArticle = req.params.idArticle;
    const sqlRecupIdUtil = 'SELECT * FROM Utilisateur WHERE uuid_util=?';
    const sqlRecupInfosArticle = 'SELECT * FROM Article WHERE uuid_article=?';
    const sqlSiUtilAdejaCommente = 'SELECT * FROM Commentaire WHERE uuid_article=? AND uuid_util=?';
    const sqlCreationCommentaire = 'INSERT INTO Commentaire (id_util, id_article, date_commentaire, commentaire, uuid_util, uuid_article) VALUES (?,?,?,?,?,?)';
    const sqlMAJnbCommentaires = 'UPDATE Article SET nb_commentaires=? WHERE uuid_article=?';
    if (uuidUtil != null && commentaire != null) {
        connexion.query(sqlRecupIdUtil, [uuidUtil], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête recupIdUtil est incorrecte !" });
            } else {
                try {
                    idUtil = rows[0].id_util;
                } catch (error) {
                    res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
                }
            }
        });
        connexion.query(sqlRecupInfosArticle, [uuidArticle], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête recupInfosArticle est incorrecte !" });
            } else {
                try {
                    idArticle = rows[0].id_article;
                    nbCommentaires = rows[0].nb_commentaires;
                } catch (error) {
                    res.status(500).json({ erreur: "L'article n'existe pas !" });
                }
            }
        });
        connexion.query(sqlSiUtilAdejaCommente, [uuidArticle, uuidUtil], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête siUtilAdejaCommente est incorrecte !" });
            } else if (rows.length == 0) {
                connexion.query(sqlCreationCommentaire, [idUtil, idArticle, dateCreation, commentaire, uuidUtil, uuidArticle], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête creationCommentaire est incorrecte !" });
                    }
                });
                nbCommentaires++;
                connexion.query(sqlMAJnbCommentaires, [nbCommentaires, uuidArticle], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête MAJnbCommentaires est incorrecte !" });
                    } else {
                        res.status(201).json({ message: "Le commentaire a été ajouté à l'article !" });
                    }
                });
            } else {
                res.status(500).json({ erreur: "L'utilisateur a déjà commenté cet article !" });
            }
        });
    } else {
        res.status(500).json({ erreur: "Les données sont incorrectes !" });
    }
}

//Requête pour modifier un commentaire : 
exports.modifyComment = function (req, res) {
    const uuidCommentaire = req.params.idCommentaire;
    let idCommentaire = 0;
    const values = req.body;
    const sqlIfCommentExist = 'SELECT * FROM Commentaire WHERE uuid_commentaire=?';
    const sqlModifyComment = 'UPDATE Commentaire SET ? WHERE id_commentaire=?';
    connexion.query(sqlIfCommentExist, [uuidCommentaire], function(err, rows, fields){
        if(err){
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        }else{
            try {
                idCommentaire = rows[0].id_commentaire;
                connexion.query(sqlModifyComment, [values, idCommentaire], function(err, rows, fields){
                    if(err){
                        res.status(500).json({ erreur: "La requête est incorrecte !" });
                    }else{
                        res.status(200).json({ message: "Le commentaire a été modifié !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "Le commentaire n'existe pas !" });
            }
        }
    });
}