/**
 * Import du package multer pour gérer les fichiers images.
 */
const multer =require('multer');

/**
 * Dictionnaire des différents types d'images.
 */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
 * Constante permettant l'enregistrement des fichiers images
 * dans le répertoire "backend/images"
 */
const strorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        const name = file.originalname.split(' ').join('_').split('.')[0];
        name.replace('.' + extension, "");
        callback(null, name + Date.now() + '.' + extension);
    }
});

/**
 * Export de la configuration du multer.
 */
module.exports = multer({ storage: strorage }).single('image');