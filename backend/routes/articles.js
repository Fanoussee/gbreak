const express = require("express");

const router = express.Router();

const ctrlArticles = require("../controllers/articles");

router.get("/", ctrlArticles.getAllArticles);
router.get("/:idArticle", ctrlArticles.getOneArticleWithId);

module.exports = router;