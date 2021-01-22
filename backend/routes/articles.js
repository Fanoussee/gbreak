const express = require("express");

const router = express.Router();

const ctrlArticles = require("../controllers/articles");

router.get("/", ctrlArticles.getAllArticles);
router.get("/:idArticle", ctrlArticles.getOneArticleWithId);
router.get("/all/:idUtil", ctrlArticles.getAllArticlesForOneUser);
router.delete("/:idArticle", ctrlArticles.deleteArticle);
router.put("/:idArticle", ctrlArticles.modifyArticle);
router.post("/", ctrlArticles.createArticle);

module.exports = router;