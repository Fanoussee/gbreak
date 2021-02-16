const express = require("express");
const multer = require('../middleware/multer-config');

const router = express.Router();

const ctrlArticles = require("../controllers/articles");
const auth = require('../middleware/auth');

router.get("/", auth, ctrlArticles.getAllArticles);
router.get("/:idArticle", auth, ctrlArticles.getOneArticleWithId);
router.get("/all/:idUtil", auth, ctrlArticles.getAllArticlesForOneUser);
router.delete("/:idArticle", auth, ctrlArticles.deleteArticle);
router.put("/:idArticle", auth, multer, ctrlArticles.modifyArticle);
router.post("/", auth, multer, ctrlArticles.createArticle);

module.exports = router;