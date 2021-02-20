const connexion = require("../connect");
const { v4: uuidV4 } = require('uuid');
const fs = require('fs');

//Requête pour obtenir tous les articles : fonctionne
exports.getAllArticles = function (req, res) {
    const sql = "SELECT uuid_article, nom, prenom, date_heure, photo, texte "
        + "FROM Article, Utilisateur "
        + "WHERE Article.uuid_util = Utilisateur.uuid_util "
        + "ORDER BY date_heure DESC";
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
    const sql = "SELECT uuid_article, article.uuid_util, nom, prenom, date_heure, photo, texte "
        + "FROM Article, Utilisateur "
        + "WHERE article.uuid_util=utilisateur.uuid_util AND uuid_article=?"
        ;
    const uuidArticle = req.params.idArticle;
    let result;
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
    const sql1 = "SELECT uuid_util FROM Utilisateur WHERE uuid_util=?";
    const sql2 = "SELECT uuid_article, nom, prenom, date_heure, photo, texte, nb_commentaires "
        + "FROM Article "
        + "WHERE uuid_util=?"
        ;
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
    let result;
    connexion.query(sql1, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_article;
                if (rows[0].photo != null) {
                    const imageUrl = rows[0].photo.split('http://localhost:3000/images/')[1];
                    fs.unlink(`images/${imageUrl}`, () => {
                        connexion.query(sql2, [uuidArticle], function (err, rows, fields) {
                            if (err) {
                                res.status(500).json({ erreur: "La requête est incorrecte !" });
                            } else {
                                res.status(200).json({ message: "L'article a été supprimé !" });
                            }
                        });
                    });
                } else {
                    connexion.query(sql2, [uuidArticle], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "L'article a été supprimé !" });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'article n'existe pas !" });
            }
        }
    });
}

//Requête pour modifier un article : fonctionne
exports.modifyArticle = function (req, res) {
    const uuidArticle = req.params.idArticle;
    const reqBody = JSON.parse(JSON.stringify(req.body));
    const article = JSON.parse(reqBody.article);
    const photoArticleModifie = article.photo;
    const texte = article.texte;
    let fichierImage = null;
    try {
        fichierImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } catch (error) {
        fichierImage = null;
    }
    const sql1 = 'SELECT * FROM Article WHERE uuid_article=?';
    const sql2 = 'UPDATE Article SET ? WHERE uuid_article=?';
    let result;
    connexion.query(sql1, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte ! " });
        } else {
            try {
                result = rows[0].uuid_article;
                const photoArticleOrigine = rows[0].photo;
                if(fichierImage != null){
                    values = { texte, photo: fichierImage };
                }else if(photoArticleModifie == photoArticleOrigine){
                    values = { texte };
                }else if(photoArticleModifie ==  null && photoArticleOrigine != null){
                    values = { texte, photo: null };
                    const imageUrl = photoArticleOrigine.split('http://localhost:3000/images/')[1];
                    fs.unlink(`images/${imageUrl}`, () => {
                        console.log("image supprimée");
                    });
                }
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
    const reqBody = JSON.parse(JSON.stringify(req.body));
    const article = JSON.parse(reqBody.article);
    const uuidArticle = uuidV4();
    const uuidUtil = article.uuid_util;
    let photo = article.photo;
    const texte = article.texte;
    let dateCreation = new Date();
    let idUtil = 0;
    const sqlRecupInfosUtil = 'SELECT * FROM Utilisateur WHERE uuid_util=?';
    const sqlCreationArticle = 'INSERT INTO Article (id_util, date_heure, photo, texte, uuid_util, uuid_article) VALUES (?,?,?,?,?,?)';
    if (photo == null && texte == null) {
        res.status(500).json({ erreur: "Les données de l'article ne peuvent être nulles !" });
    } else {
        connexion.query(sqlRecupInfosUtil, [uuidUtil], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête est incorrecte !" });
            } else {
                try {
                    idUtil = rows[0].id_util;
                    if (photo != null) {
                        photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    }
                    connexion.query(sqlCreationArticle, [idUtil, dateCreation, photo, texte, uuidUtil, uuidArticle], function (err, rows, fields) {
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