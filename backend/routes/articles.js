const express = require("express");
const multer = require('../middleware/multer-config');

const router = express.Router();

const ctrlArticles = require("../controllers/articles");
const auth = require('../middleware/auth');

router.get("/", ctrlArticles.getAllArticles);
router.get("/:idArticle", ctrlArticles.getOneArticleWithId);
router.get("/all/:idUtil", ctrlArticles.getAllArticlesForOneUser);
router.delete("/:idArticle", ctrlArticles.deleteArticle);
router.put("/:idArticle", ctrlArticles.modifyArticle);
router.post("/", multer, ctrlArticles.createArticle);

module.exports = router;