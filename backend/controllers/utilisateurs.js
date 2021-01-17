const connexion = require("../connect");

//Requête pour obtenir tous les utilisateurs
exports.getAllUsers = function (req, res) {
    const sql = 'SELECT * FROM Utilisateur';
    connexion.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        }
        res.status(200).json(rows);
    });
};

//Requête pour obtenir un utilisateur
exports.getOneUser = function (req, res) {
    const sql = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const idUtil = req.params.id;
    let result = 0;
    connexion.query(sql, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                result = rows[0].id_util;
                if (result == idUtil) {
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
};

//Requête pour supprimer un utilisateur
exports.deleteOneUser = function (req, res) {
    const idUtil = req.params.id;
    const sql1 = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const sql2 = 'DELETE FROM Utilisateur WHERE id_util=?';
    let idUserToDelete = 0;
    connexion.query(sql1, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête est incorrecte !" });
        } else {
            try {
                idUserToDelete = rows[0].id_util;
                if (idUserToDelete == idUtil) {
                    connexion.query(sql2, [idUtil], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "Utilisateur supprimé !" });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
};

//Requête pour modifier un utilisateur
exports.modifyOneUser = function (req, res) {
    const idUtil = req.params.id;
    const sql1 = 'SELECT * FROM Utilisateur WHERE id_util=?';
    const sql2 = 'UPDATE Utilisateur SET ? WHERE id_util=?';
    const values = req.body;
    let idUserToModify = 0;
    connexion.query(sql1, [idUtil], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La 1ère requête est incorrecte !" });
        } else {
            try {
                idUserToModify = rows[0].id_util;
                if (idUserToModify == idUtil) {
                    connexion.query(sql2, [values, idUtil], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La 2e requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "Utilisateur modifié !" });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ erreur: "L'utilisateur n'existe pas !" });
            }
        }
    });
};

//Requête pour créer un utilisateur
exports.createUser = function (req, res) {
    const values = req.body;
    const sql1 = 'SELECT id_util FROM Utilisateur WHERE nom=? AND prenom=? AND date_naiss=?';
    const sql2 = 'INSERT INTO Utilisateur (nom, prenom, date_naiss, mot_passe, moderateur) VALUES (?,?,?,?,?)';
    connexion.query(sql1, [values.nom, values.prenom, values.date_naiss], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La 1ere requête est incorrecte !" });
        } else {
            try {
                if (rows[0].id_util > 0) {
                    res.status(500).json({ erreur: "L'utilisateur existe déjà !" });
                }
            } catch (error) {
                connexion.query(sql2,
                    [values.nom, values.prenom, values.date_naiss, values.mot_passe, values.moderateur],
                    function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ erreur: "La 2e requête est incorrecte !" });
                        } else {
                            res.status(200).json({ message: "Utilisateur créé !" });
                        }
                    });
            }
        }
    });
};