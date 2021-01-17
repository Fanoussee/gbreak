const { restart } = require("nodemon");
const connexion = require("../connect");

exports.getAllArticles = function(req, res){
    const sql = 'SELECT * FROM Article';
    connexion.query(sql, function(err, rows, fields){
        if(err){
            res.status(500).json({ erreur : "La requête est incorrecte !" });
        }else{
            res.status(200).json(rows);
        }
    });
}

exports.getOneArticleWithId = function(req, res){
    const sql = 'SELECT * FROM Article WHERE id_article=?';
    const idArticle = req.params.idArticle;
    let result = 0;
    connexion.query(sql, [idArticle], function(err, rows, fields){
        if(err){
            res.status(500).json({ erreur : "La requête est incorrecte !"});
        }else{
            try {
                result = rows[0].id_article;
                if(result == idArticle){
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur : "L'article n'existe pas !"});
            }
        }
    });
}