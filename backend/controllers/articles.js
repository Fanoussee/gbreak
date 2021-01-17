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