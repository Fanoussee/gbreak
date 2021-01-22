const express = require('express');
const router = express.Router();
const ctrlCommentaires = require('../controllers/commentaires');

router.get("/:idArticle", ctrlCommentaires.getAllCommentsByIdArticle);
router.post("/:idArticle", ctrlCommentaires.createComment);

module.exports = router;