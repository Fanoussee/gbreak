/**
 * Import du framework Express
 */
const express = require('express');
/**
 * Création d'un router
 */
const router = express.Router();
/**
 * Import du middleware des commentaires
 */
const ctrlCommentaires = require('../controllers/commentaires');
/**
 * Import du middleware d'authentification
 */
const auth = require('../middleware/auth');

//Les différentes routes avec leurs endpoints pour les commentaires.
//L'utilisateur doit être obligatoirement authentifié pour y accéder.
router.post("/:idArticle", auth, ctrlCommentaires.createComment);
router.get("/:idArticle", auth, ctrlCommentaires.getAllCommentsByIdArticle);
router.put("/:idCommentaire", auth, ctrlCommentaires.modifyComment);
router.delete("/:idCommentaire", auth, ctrlCommentaires.deleteComment);

/**
 * Export du router pour les articles
 */
module.exports = router;