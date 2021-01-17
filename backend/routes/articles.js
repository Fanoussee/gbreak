const express = require("express");

const router = express.Router();

const ctrlArticles = require("../controllers/articles");

router.get("/", ctrlArticles.getAllArticles);

module.exports = router;