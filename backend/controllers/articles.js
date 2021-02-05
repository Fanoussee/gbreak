const { restart } = require("nodemon");
const connexion = require("../connect");
const { v4: uuidV4 } = require('uuid');

//Requête pour obtenir tous les articles : fonctionne
exports.getAllArticles = function (req, res) {
    const sql = 'SELECT * FROM Article';
    connexion.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            res.status(200).json(rows);
        }
    });
}

//Requête pour obtenir un article avec son identifiant uuid : fonctionne
exports.getOneArticleWithId = function (req, res) {
    const sql = 'SELECT * FROM Article WHERE uuid_article=?';
    const uuidArticle = req.params.idArticle;
    let result = 0;
    connexion.query(sql, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_article;
                if (result == uuidArticle) {
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'article n'existe pas !" });
            }
        }
    });
}

//Requête pour obtenir tous les articles créés par un utilisateur : fonctionne
exports.getAllArticlesForOneUser = function (req, res) {
    const sql1 = 'SELECT * FROM Utilisateur WHERE uuid_util=?';
    const sql2 = 'SELECT * FROM Article WHERE uuid_util=?';
    const uuidUtil = req.params.idUtil;
    let result = 0;
    connexion.query(sql1, [uuidUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_util;
                if (uuidUtil == result) {
                    connexion.query(sql2, [uuidUtil], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La requête est incorrecte !" });
                        } else {
                            try {
                                result = rows[0].uuid_util;
                                if (uuidUtil == result) {
                                    res.status(200).json(rows);
                                }
                            } catch (error) {
                                res.status(500).json({ erreur: "L'utilisateur n'a pas créé d'article !" });
                            }
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
}

//Requête pour supprimer un article : fonctionne
exports.deleteArticle = function (req, res) {
    const sql1 = 'SELECT * FROM Article WHERE uuid_article=?';
    const sql2 = 'DELETE FROM Article WHERE uuid_article=?';
    const uuidArticle = req.params.idArticle;
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
                    } else {
                        res.status(200).json({ message: "L'article a été supprimé !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "L'article n'existe pas !" });
            }
        }
    });
}

//Requête pour modifier un article : fonctionne
exports.modifyArticle = function (req, res) {
    const sql1 = 'SELECT * FROM Article WHERE uuid_article=?';
    const sql2 = 'UPDATE Article SET ? WHERE uuid_article=?';
    const uuidArticle = req.params.idArticle;
    const values = req.body;
    let result = 0;
    connexion.query(sql1, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte ! " });
        } else {
            try {
                result = rows[0].uuid_article;
                connexion.query(sql2, [values, uuidArticle], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête est incorrecte ! " });
                    } else {
                        res.status(200).json({ message: "L'article a été modifié !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "L'article n'existe pas !" });
            }
        }
    });
}

//Requête pour créer un article : fonctionne
exports.createArticle = function (req, res) {
    let idUtil = 0;
    let dateCreation = new Date();
    const photo = req.body.photo;
    const texte = req.body.texte;
    const nbCommentaires = 0;
    const uuidUtil = req.body.uuid_util;
    const uuidArticle = uuidV4();
    const sqlRecupInfosUtil = 'SELECT * FROM Utilisateur WHERE uuid_util=?';
    const sqlCreationArticle = 'INSERT INTO Article (id_util, date_heure, photo, texte, nb_commentaires, uuid_util, uuid_article) VALUES (?,?,?,?,?,?,?)';
    if (photo == null && texte == null) {
        res.status(500).json({ erreur: "Les données de l'article ne peuvent être nulles !" });
    } else {
        //const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        connexion.query(sqlRecupInfosUtil, [uuidUtil], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête est incorrecte !" });
            } else {
                try {
                    idUtil = rows[0].id_util;
                    connexion.query(sqlCreationArticle, [idUtil, dateCreation, photo, texte, nbCommentaires, uuidUtil, uuidArticle], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "L'article a été ajouté !" });
                        }
                    });
                } catch (error) {
                    res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
                }
            }
        });
    }
}