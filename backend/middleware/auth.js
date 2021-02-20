/**
 * Import du package jsonwebtoken pour la gestion d'un token d'identification
 */
const jwt = require('jsonwebtoken');

/**
 * Cette fonction permet de vérifier le token envoyé dans la requête
 * pour savoir si l'utilisateur a le droit d'accéder aux routes protégées.
 * @param {*} req La requête reçue
 * @requires token : dans l'en tête de la requête
 * @requires uuid_util
 * @param {*} res La réponse envoyée
 * @param {*} next Permet d'aller à l'étape suivante
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const uuid_util = decodedToken.subject;
        if (req.body.uuid_util && req.body.uuid_util !== uuid_util) {
            throw "L'identifiant de l'utilisateur est incorrect !";
        }else{
            next();
        }
    } catch (error) {
        res.status(401).json({ erreur: error | 'Requête non authentifiée !' });
    }
}