const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const uuid_util = decodedToken.uuid_util;
        if (req.body.uuid_util && req.body.uuid_util !== uuid_util) {
            throw "L'identifiant de l'utilisateur est incorrect !";
        }else{
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
}