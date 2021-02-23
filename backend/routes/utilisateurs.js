/**
 * Import du framework Express
 */
const express = require('express');
/**
 * Création d'un router
 */
const router = express.Router();
/**
 * Import du middleware des utilisateurs
 */
const ctrlUtilisateur = require("../controllers/utilisateurs");
/**
 * Import du middleware d'authentification
 */
const auth = require("../middleware/auth");

//Les différentes routes avec leurs endpoints pour les utilisateurs.
//L'utilisateur doit être parfois authentifié pour y accéder.
router.post("/connexion", ctrlUtilisateur.connectUser);
router.post("/inscription", ctrlUtilisateur.createUser);
router.get("/", auth, ctrlUtilisateur.getAllUsers);
router.get("/:id", auth, ctrlUtilisateur.getOneUser);
router.delete("/:id", auth, ctrlUtilisateur.deleteOneUser);

/**
 * Export du router pour les articles
 */
module.exports = router;