const express = require('express');
const router = express.Router();
const ctrlUtilisateur = require("../controllers/utilisateurs");
const auth = require("../middleware/auth");

router.get("/", auth, ctrlUtilisateur.getAllUsers);
router.get("/:id", auth, ctrlUtilisateur.getOneUser);
router.delete("/:id", auth, ctrlUtilisateur.deleteOneUser);
router.put("/:id", auth, ctrlUtilisateur.modifyOneUser);
router.post("/inscription", ctrlUtilisateur.createUser);
router.post("/connexion", ctrlUtilisateur.connectUser);

module.exports = router;