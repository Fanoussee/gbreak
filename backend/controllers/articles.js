const { restart } = require("nodemon");
const connexion = require("../connect");

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

exports.getOneArticleWithId = function (req, res) {
    const sql = 'SELECT * FROM Article WHERE id_article=?';
    const idArticle = req.params.idArticle;
    let result = 0;
    connexion.query(sql, [idArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].id_article;
                if (result == idArticle) {
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'article n'existe pas !" });
            }
        }
    });
}

exports.getAllArticlesForOneUser = function (req, res) {
    const sql1 = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const sql2 = 'SELECT * FROM Article WHERE id_util=?';
    const idUtil = req.params.idUtil;
    let result = 0;
    connexion.query(sql1, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].id_util;
                if (idUtil == result) {
                    connexion.query(sql2, [idUtil], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La requête est incorrecte !" });
                        } else {
                            try {
                                result = rows[0].id_util;
                                if (idUtil == result) {
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

exports.deleteArticle = function (req, res) {
    const sql1 = 'SELECT * FROM Article WHERE id_article=?';
    const sql2 = 'DELETE FROM Article WHERE id_article=?';
    const idArticle = req.params.idArticle;
    let result = 0;
    connexion.query(sql1, [idArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].id_article;
                connexion.query(sql2, [idArticle], function (err, rows, fields) {
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

exports.modifyArticle = function (req, res) {
    const sql1 = 'SELECT * FROM Article WHERE id_article=?';
    const sql2 = 'UPDATE Article SET ? WHERE id_article=?';
    const idArticle = req.params.idArticle;
    const values = req.body;
    let result = 0;
    connexion.query(sql1, [idArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte ! " });
        } else {
            try {
                result = rows[0].id_article;
                connexion.query(sql2, [values, idArticle], function (err, rows, fields) {
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

exports.createArticle = function (req, res) {
    const sql1 = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const sql2 = 'INSERT INTO Article (id_util, date_heure, photo, texte, nb_commentaires) VALUES (?,?,?,?,?)';
    const idUtil = req.body.id_util;
    const values = req.body;
    let result = 0;
    let dateCreation = new Date();
    connexion.query(sql1, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].id_util;
                if (values.texte == null && values.photo == null) {
                    res.status(500).json({ erreur: "L'article ne peut pas être vide !" });
                } else {
                    connexion.query(sql2,
                        [values.id_util, dateCreation, values.photo, values.texte, 0],
                        function (err, rows, fields) {
                            if (err) {
                                res.status(500).json({ erreur: "La requête est incorrecte !" });
                            } else {
                                res.status(200).json({ message: "L'article a été ajouté !" });
                            }
                        });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
}