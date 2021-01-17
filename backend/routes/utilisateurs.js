const express = require('express');
const router = express.Router();
const ctrlUtilisateur = require("../controllers/utilisateurs");

router.get("/", ctrlUtilisateur.getAllUsers);
router.get("/:id", ctrlUtilisateur.getOneUser);
router.delete("/:id", ctrlUtilisateur.deleteOneUser);
router.put("/:id", ctrlUtilisateur.modifyOneUser);
router.post("/", ctrlUtilisateur.createUser);

module.exports = router;