const express = require('express');
const router = express.Router();
const ctrlCommentaires = require('../controllers/commentaires');

const auth = require('../middleware/auth');

router.get("/", auth, ctrlCommentaires.getAllComments);
router.get("/:idArticle", auth, ctrlCommentaires.getAllCommentsByIdArticle);
router.post("/:idArticle", auth, ctrlCommentaires.createComment);
router.put("/:idCommentaire", auth, ctrlCommentaires.modifyComment);
router.delete("/:idCommentaire", auth, ctrlCommentaires.deleteComment);

module.exports = router;