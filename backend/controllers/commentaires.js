/**
 * Cette constante permet de récupérer les informations de connexion à la base de données.
 */
const connexion = require('../connect');
/**
 * Cette constante permet de récupérer l'outil uuid afin de générer un identifiant unique 
 * pour chaque commentaire.
 */
const { v4: uuidV4 } = require('uuid');

//Implémentation du CRUD--------------------------------------------------------------------------

//CREATE------------------------------------------------------------------------------------------

/**
 * Cette fonction permet de créer un commentaire sur un article.
 * @param {*} req La requête reçue
 * @requires uuid_article
 * @requires objet - { uuid_util, commentaire }
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { message: "createComment - Le commentaire a été ajouté !" }
 * ou un objet : { erreur: texte de l'erreur }
 */
exports.createComment = function (req, res) {
    const uuidArticle = req.params.idArticle;
    const uuidUtil = req.body.uuid_util;
    const commentaire = req.body.commentaire;
    const uuidComment = uuidV4();
    const dateCreation = new Date();
    /**
     * Cette variable permet de :
     * - savoir si l'utilisateur existe
     * - récupérer son identifiant
     */
    let idUtil ;
    /**
     * Cette variable permet de :
     * - savoir si l'article existe
     * - récupérer son identifiant
     */
    let idArticle ;
    const sqlIfUtilExists = "SELECT id_util FROM Utilisateur WHERE uuid_util=?";
    const sqlIfArticleExists = "SELECT id_article FROM Article WHERE uuid_article=?";
    const sqlCreationCommentaire = 
        "INSERT INTO Commentaire " +
        "(id_util, id_article, date_commentaire, commentaire, " +
        "uuid_util, uuid_article, uuid_commentaire) " +
        "VALUES (?,?,?,?,?,?,?)";
    if (uuidUtil != null && commentaire != null) {
        connexion.query(sqlIfUtilExists, [uuidUtil], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête createComment-IfUtilExists est incorrecte !" });
            } else {
                try {
                    idUtil = rows[0].id_util;
                    connexion.query(sqlIfArticleExists, [uuidArticle], function (err, rows, fields) {
                        if (err) {
                            res.status(500).json({ 
                                erreur: "La requête Commentaires-recupInfosArticle est incorrecte !" 
                            });
                        } else {
                            try {
                                idArticle = rows[0].id_article;
                                connexion.query(
                                    sqlCreationCommentaire, 
                                    [
                                        idUtil, 
                                        idArticle, 
                                        dateCreation, 
                                        commentaire, 
                                        uuidUtil, 
                                        uuidArticle, 
                                        uuidComment
                                    ],
                                     function (err, rows, fields) {
                                    if (err) {
                                        res.status(500).json({ 
                                            erreur: "La requête createComment-CreationCommentaire est incorrecte !" 
                                        });
                                    }else{
                                        res.status(201).json({ 
                                            message: "createComment - Le commentaire a été ajouté à l'article !" 
                                        });
                                    }
                                });
                            } catch (error) {
                                res.status(500).json({ erreur: "createComment - L'article n'existe pas !" });
                            }
                        }
                    });
                } catch (error) {
                    res.status(500).json({ erreur: "createComment - L'utilisateur n'existe pas !" });
                }
            }
        });
    } else {
        res.status(500).json({ erreur: "createComment - Les données sont incorrectes !" });
    }
}

//READ--------------------------------------------------------------------------------------------

/**
 * Cette fonction permet :
 * - d'obtenir tous les commentaires d'un article à l'aide de l'uuid de l'article
 * - de classer les commentaires du plus ancien au plus récent
 * @param {*} req La requête reçue
 * @requires uuid_article
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { uuid_commentaire, uuid_util, nom, prenom, date_commentaire, commentaire }
 * ou un objet vide s'il n'y a pas de commentaire pour cet article
 * ou un objet : { erreur : texte de l'erreur }
 */
exports.getAllCommentsByIdArticle = function (req, res) {
    const uuidArticle = req.params.idArticle;
    const sqlIfArticleExists = "SELECT uuid_article FROM Article WHERE uuid_Article=?";
    const sqlAllCommentsByArticle = 
        "SELECT uuid_commentaire, Commentaire.uuid_util, nom, prenom, date_commentaire, commentaire " +
        "FROM Utilisateur, Commentaire " +
        "WHERE Commentaire.uuid_util = Utilisateur.uuid_util AND Commentaire.uuid_article=? " +
        "ORDER BY date_commentaire";
    /**
     * Cette variable permet de savoir si l'article existe
     */
    let result ;
    connexion.query(sqlIfArticleExists, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ 
                erreur: "getAllCommentsByIdArticle-IfArticleExists - La requête est incorrecte !" 
            });
        } else {
            try {
                result = rows[0].uuid_article;
                connexion.query(sqlAllCommentsByArticle, [uuidArticle], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ 
                            erreur: 
                            "getAllCommentsByIdArticle-AllCommentsByArticle - La requête est incorrecte !" 
                        });
                    } else if (rows.length == 0) {
                        res.status(200).json([]);
                    } else {
                        res.status(200).json(rows);
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "getAllCommentsByIdArticle - L'article n'existe pas !" });
            }
        }
    });
}

//UDPATE------------------------------------------------------------------------------------------

/**
 * Cette fonction permet de modifier un commentaire à l'aide de son uuid.
 * @param {*} req La requête reçue
 * @requires uuid_commentaire
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { message: "modifyComment - Le commentaire a été modifié !" }
 * ou un objet : { erreur: texte de l'erreur }
 */
exports.modifyComment = function (req, res) {
    const uuidCommentaire = req.params.idCommentaire;
    const values = req.body;
    /**
     * Cette variable permet de :
     * - savoir si le commentaire existe
     * - récupérer son identifiant
     */
    let idCommentaire ;
    const sqlIfCommentExist = "SELECT id_commentaire FROM Commentaire WHERE uuid_commentaire=?";
    const sqlModifyComment = "UPDATE Commentaire SET ? WHERE id_commentaire=?";
    connexion.query(sqlIfCommentExist, [uuidCommentaire], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "modifyComment-IfCommentExists - La requête est incorrecte !" });
        } else {
            try {
                idCommentaire = rows[0].id_commentaire;
                connexion.query(sqlModifyComment, [values, idCommentaire], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "modifyComment - La requête est incorrecte !" });
                    } else {
                        res.status(200).json({ message: "modifyComment - Le commentaire a été modifié !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "modifyComment - Le commentaire n'existe pas !" });
            }
        }
    });
}

//DELETE------------------------------------------------------------------------------------------

/**
 * Cette fonction permet de supprimer un commentaire à l'aide de son uuid.
 * @param {*} req La requête reçue
 * @requires uuid_commentaire
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet { message : "deleteComment - Le commentaire a été supprimé !" }
 * ou un objet { erreur : texte de l'erreur }.
 */
exports.deleteComment = function (req, res) {
    const uuidCommentaire = req.params.idCommentaire;
    /**
     * Cette variable permet de savoir si le commentaire existe.
     */
    let result ;
    const sqlIfCommentExist = "SELECT uuid_commentaire FROM Commentaire WHERE uuid_commentaire=?";
    const sqlDeleteComment = "DELETE FROM Commentaire WHERE uuid_commentaire=?";
    connexion.query(sqlIfCommentExist, [uuidCommentaire], function (err, rows, fields) {
        if (err) {
            res.status(500).json({
                erreur: "La requête deleteComment-ifCommentExist est incorrecte !"
            });
        } else {
            try {
                result = rows[0].uuid_commentaire;
                connexion.query(sqlDeleteComment, [uuidCommentaire], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({
                            erreur: "La requête deleteComment est incorrecte !"
                        });
                    } else {
                        res.status(200).json({ message: "deleteComment - Le commentaire a été supprimé !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "deleteComment - Le commentaire n'existe pas !" });
            }
        }
    });
}