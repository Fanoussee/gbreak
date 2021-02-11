const express = require('express');
const router = express.Router();
const ctrlCommentaires = require('../controllers/commentaires');

router.get("/", ctrlCommentaires.getAllComments);
router.get("/:idArticle", ctrlCommentaires.getAllCommentsByIdArticle);
router.post("/:idArticle", ctrlCommentaires.createComment);
router.put("/:idCommentaire", ctrlCommentaires.modifyComment);
router.delete("/:idCommentaire" ,ctrlCommentaires.deleteComment);

module.exports = router;