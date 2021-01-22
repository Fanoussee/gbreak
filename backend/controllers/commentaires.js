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

