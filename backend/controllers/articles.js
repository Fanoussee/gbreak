/**
 * Cette constante permet de récupérer les informations de connexion à la base de données.
 */
const connexion = require("../connect");
/**
 * Cette constante permet de récupérer l'outil uuid afin de générer un identifiant unique 
 * pour chaque article.
 */
const { v4: uuidV4 } = require('uuid');
/**
 * Cette constante permet de récupérer l'outil de gestion des fichiers 
 * pour gérer les images des articles.
 */
const fs = require('fs');

/**
 * Cette fonction permet de supprimer une image enregistrée dans le répertoire "backend/images".
 * @param {*} image Lien et nom de l'image à supprimer
 */
function deleteImage(image){
    const imageUrl = image.split('http://localhost:3000/images/')[1];
    fs.unlink(`images/${imageUrl}`, () => {
        console.log("L'image a été supprimée du répertoire !");
    });
}

//Implémentation du CRUD--------------------------------------------------------------------------

//CREATE------------------------------------------------------------------------------------------

/**
 * Cette fonction permet de créer un article.
 * @param {*} req La requête reçue
 * @requires objet - { uuid_util, photo, texte }
 * @file image facultative
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { message: "createArticle - L'article a été ajouté !" }
 * ou un objet : { erreur: texte de l'erreur }
 */
exports.createArticle = function (req, res) {
    const reqBody = JSON.parse(JSON.stringify(req.body));
    const article = JSON.parse(reqBody.article);
    const uuidArticle = uuidV4();
    const uuidUtil = article.uuid_util;
    let photo = article.photo;
    const texte = article.texte;
    let dateCreation = new Date();
    /**
     * Cette variable permet de :
     * - savoir si l'utilisateur existe
     * - récupérer son identifiant
     */
    let idUtil ;
    const sqlIfUtilExists = "SELECT id_util FROM Utilisateur WHERE uuid_util=?";
    const sqlCreationArticle = 
        "INSERT INTO Article " +
        "(id_util, date_heure, photo, texte, uuid_util, uuid_article) " +
        "VALUES (?,?,?,?,?,?)";
    if (photo == null && texte == null) {
        res.status(500).json({ erreur: "createArticle - Les données de l'article ne peuvent être nulles !" });
    } else {
        connexion.query(sqlIfUtilExists, [uuidUtil], function (err, rows, fields) {
            if (err) {
                res.status(500).json({ erreur: "La requête createArticle-RecupInfosUtil est incorrecte !" });
            } else {
                try {
                    idUtil = rows[0].id_util;
                    if (photo != null) {
                        photo = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    }
                    connexion.query(
                        sqlCreationArticle, 
                        [idUtil, dateCreation, photo, texte, uuidUtil, uuidArticle], 
                        function (err, rows, fields) {
                            if (err) {
                                res.status(500).json({
                                    erreur: "La requête createArticle-CreationArticle est incorrecte !" });
                            } else {
                                res.status(200).json({ message: "createArticle - L'article a été ajouté !" });
                            }
                        }
                    );
                } catch (error) {
                    res.status(500).json({ erreur: "createArticle - L'utilisateur n'existe pas !" });
                }
            }
        });
    }
}

//READ--------------------------------------------------------------------------------------------

/**
 * Cette fonction permet :
 * - d'obtenir la liste des articles enregistrés dans la base de données ;
 * - les classe du plus récent au plus ancien.
 * @param {*} req La requête reçue
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { l'uuid de l'article, le nom et le prenom du créateur de l'article,
 * la date et l'heure de la création de l'article, la photo et le texte de l'article }
 * ou un objet : { erreur : texte de l'erreur }
 */
exports.getAllArticles = function (req, res) {
    const sql = "SELECT uuid_article, nom, prenom, date_heure, photo, texte "
        + "FROM Article, Utilisateur "
        + "WHERE Article.uuid_util = Utilisateur.uuid_util "
        + "ORDER BY date_heure DESC";
    connexion.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête getAllArticles est incorrecte !" });
        } else {
            res.status(200).json(rows);
        }
    });
}

/**
 * Cette fonction permet d'obtenir les informations d'un article à l'aide de son uuid.
 * @param {*} req La requête reçue
 * @requires uuid_article
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { l'uuid de l'article, l'uuid de l'utilisateur qui a créé cet article 
 * ainsi que son nom et son prénom, la date et l'heure de la création de l'article, la photo 
 * et le texte de l'article }
 * ou un objet : { erreur : texte de l'erreur }
 */
exports.getOneArticleWithId = function (req, res) {
    const sql = "SELECT uuid_article, article.uuid_util, nom, prenom, date_heure, photo, texte "
        + "FROM Article, Utilisateur "
        + "WHERE article.uuid_util=utilisateur.uuid_util AND uuid_article=?"
        ;
    const uuidArticle = req.params.idArticle;
    /**
     * Cette variable permet de savoir si l'article existe ou non.
     */
    let result ;
    connexion.query(sql, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête getOneArticleWithId est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_article;
                if (result == uuidArticle) {
                    res.status(200).json(rows);
                }
            } catch (error) {
                res.status(500).json({ erreur: "getOneArticleWithId - L'article n'existe pas !" });
            }
        }
    });
}

//UPDATE------------------------------------------------------------------------------------------

/**
 * Cette fonction permet de :
 * - modifier les informations d'un article à l'aide de son uuid ;
 * - supprime l'ancienne image du répertoire "backend/images" si l'utilisateur supprime l'image
 * de l'article ou s'il la remplace par une nouvelle image.
 * @param {*} req La requête reçue
 * @requires uuid_article
 * @file image facultative
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet : { message: "modifyArticle - L'article a été modifié !" }
 * ou un objet : { erreur: texte de l'erreur }
 */
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
    const sqlIfArticleExists = "SELECT uuid_article, photo FROM Article WHERE uuid_article=?";
    const sqlModifyArticle = "UPDATE Article SET ? WHERE uuid_article=?";
    /**
     * Cette variable permet de savoir si l'article existe ou non.
     */
    let result ;
    connexion.query(sqlIfArticleExists, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête modifyArticle-IfArticleExists est incorrecte ! " });
        } else {
            try {
                result = rows[0].uuid_article;
                const photoArticleOrigine = rows[0].photo;
                if (fichierImage != null) {
                    values = { texte, photo: fichierImage };
                    if(photoArticleOrigine != null){
                        deleteImage(photoArticleOrigine);
                    }
                } else if (photoArticleModifie == photoArticleOrigine) {
                    values = { texte };
                } else if (photoArticleModifie == null && photoArticleOrigine != null) {
                    values = { texte, photo: null };
                    deleteImage(photoArticleOrigine);
                }
                connexion.query(sqlModifyArticle, [values, uuidArticle], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête modifyArticle-ModifyArticle est incorrecte ! " });
                    } else {
                        res.status(200).json({ message: "modifyArticle - L'article a été modifié !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "modifyArticle - L'article n'existe pas !" });
            }
        }
    });
}

//DELETE------------------------------------------------------------------------------------------

/**
 * Cette fonction permet de :
 * - supprimer un article à l'aide de son uuid
 * - supprime l'image du répertoire "backend/images" s'il y en a une.
 * @param {*} req La requête reçue
 * @requires uuid_article
 * @param {*} res La réponse à envoyer
 * @returns
 * Un objet { message : "deleteArticle - L'article a été supprimé !" }
 * ou un objet { erreur : texte de l'erreur }.
 */
exports.deleteArticle = function (req, res) {
    const sqlIfArticleExists = "SELECT uuid_article, photo FROM Article WHERE uuid_article=?";
    const sqlDeleteArticle = "DELETE FROM Article WHERE uuid_article=?";
    const uuidArticle = req.params.idArticle;
    /**
     * Cette variable permet de savoir si l'article existe ou non.
     */
    let result ;
    connexion.query(sqlIfArticleExists, [uuidArticle], function (err, rows, fields) {
        if (err) {
            res.status(500).json({ erreur: "La requête deleteArticle-IfArticleExists est incorrecte !" });
        } else {
            try {
                result = rows[0].uuid_article;
                if (rows[0].photo != null) {
                    deleteImage(rows[0].photo);
                }
                connexion.query(sqlDeleteArticle, [uuidArticle], function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({ erreur: "La requête deleteArticle-DeleteArticle est incorrecte !" });
                    } else {
                        res.status(200).json({ message: "deleteArticle - L'article a été supprimé !" });
                    }
                });
            } catch (error) {
                res.status(500).json({ erreur: "deleteArticle - L'article n'existe pas !" });
            }
        }
    });
}