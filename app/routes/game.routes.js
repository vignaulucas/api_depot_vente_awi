const controller = require('../controllers/game.controllers');
const { isLoggedIn, isAdmin, isGestionnaire } = require('../middlewares/auth');

module.exports = app => {
    const router = require('express').Router();

    // Routes GET
    router.get('/games', isLoggedIn, controller.getAllGames);
    router.get('/games/:id', isLoggedIn, controller.getGameById);
    router.get('/games/user/:userId', isLoggedIn, controller.getGamesBySeller);
    // Routes POST
    router.post('/games', isLoggedIn, isGestionnaire, controller.createGame);

    // Routes PATCH
    router.patch('/games/:id', isLoggedIn, isGestionnaire, controller.updateGame); 

    // Routes DELETE
    router.delete('/games/:id', isLoggedIn, isGestionnaire, controller.deleteGame); 

    app.use('/depot', router);
};
