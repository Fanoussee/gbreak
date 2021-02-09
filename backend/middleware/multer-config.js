const multer =require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

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

module.exports = multer({ storage: strorage }).single('image');