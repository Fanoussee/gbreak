const connexion = require('../connect');

exports.getAllCommentsByIdArticle = function (req, res) {
    const idArticle = req.params.idArticle;
    const sql1 = 'SELECT * FROM Article WHERE id_Article=?';
    const sql2 = 'SELECT * FROM Commentaire WHERE id_Article=?';
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

exports.createComment = function (req, res) {
    const sql1 = 'SELECT * FROM Article WHERE id_article=?';
    const sql2 = 'SELECT * FROM Commentaire WHERE id_article=? AND id_util=?';
    const sql3 = 'INSERT INTO Commentaire (id_article, id_util, date_commentaire, commentaire) VALUES (?,?,?,?)';
    const sql4 = 'UPDATE Article SET nb_commentaires=? WHERE id_article=?';
    const idArticle = req.params.idArticle;
    const values = req.body;
    let result = 0;
    let nbCommentaires = 0;
    const dateCreation = new Date();
    connexion.query(sql1, [idArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête 1 est incorrecte !" });
        } else {
            try {
                result = rows[0].id_article;
                nbCommentaires = rows[0].nb_commentaires;
                connexion.query(sql2, [idArticle, values.id_util], function(err, rows, fields){
                    if(err){
                        res.status(500).json({ erreur: "La requête 2 est incorrecte !" });
                    }else{
                        if(rows.length == 0){
                            connexion.query(sql3, [idArticle, values.id_util, dateCreation, values.commentaire], function (err, rows, fields) {
                                if (err) {
                                    res.status(500).json({ erreur: "La requête 3 est incorrecte !" });
                                }else{
                                    nbCommentaires ++;
                                    connexion.query(sql4, [nbCommentaires, idArticle], function (err, rows, fields) {
                                        if (err) {
                                            res.status(500).json({ erreur: "La requête 4 est incorrecte !" });
                                        } else {
                                            res.status(201).json({ message: "Le commentaire a été ajouté à l'article !" });
                                        }
                                    });
                                }
                            });
                        }else{
                            res.status(500).json({ erreur: "L'utilisateur a déjà commenté cet article !" });
                        }
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "L'article n'existe pas !" });
            }
        }
    });
}