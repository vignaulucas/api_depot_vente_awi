const csvController = require('../controllers/fileCsv.controllers');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const multer = require('multer');

module.exports = app => {
    const router = require('express').Router();
    const upload = multer({ dest: 'uploads/' });

    router.get('/get', isLoggedIn, csvController.getCsv);
    router.get("/game/:name", csvController.getGameDetailsByName);

    router.post('/post', isLoggedIn, isAdmin, upload.single('file'), csvController.importCsv);

    app.use('/csv', router);
};
