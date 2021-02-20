/**
 * Import du framework Express
 */
const express = require("express");
/**
 * Import du middleware pour la gestion des images
 */
const multer = require('../middleware/multer-config');
/**
 * Création d'un router
 */
const router = express.Router();
/**
 * Import du middleware des articles
 */
const ctrlArticles = require("../controllers/articles");
/**
 * Import du middleware d'authentification
 */
const auth = require('../middleware/auth');

//Les différentes routes avec leurs endpoints pour les articles.
//L'utilisateur doit être obligatoirement authentifié pour y accéder.
router.post("/", auth, multer, ctrlArticles.createArticle);
router.get("/", auth, ctrlArticles.getAllArticles);
router.get("/:idArticle", auth, ctrlArticles.getOneArticleWithId);
router.put("/:idArticle", auth, multer, ctrlArticles.modifyArticle);
router.delete("/:idArticle", auth, ctrlArticles.deleteArticle);

/**
 * Export du router pour les articles
 */
module.exports = router;