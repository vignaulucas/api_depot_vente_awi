const controller = require('../controllers/game.controllers');
const { isLoggedIn, isAdmin, isGestionnaire } = require('../middlewares/auth');

module.exports = app => {
    const router = require('express').Router();

    // Routes GET
    router.get('/games', isLoggedIn, controller.getAllGames);
    router.get('/depositGames/:saleSessionId', isLoggedIn, isGestionnaire, controller.getAllDepositGames);
    router.get('/forSaleGames/:saleSessionId', controller.getAllForSaleGames);
    router.get('/saleGames/:saleSessionId', controller.getAllSaleGames);
    router.get('/games/:id', isLoggedIn, controller.getGameById);
    router.get('/games/user/:userId', isLoggedIn, controller.getGamesBySeller);
    router.get('/totalDepositFees/:saleSessionId', isLoggedIn, isGestionnaire, controller.getTotalDepositFeesBySession);
    router.get('/sellGames/:saleSessionId/:idUser', isLoggedIn, controller.getAllForSaleGamesForIdUser);
    router.get('/sellGamesNonUser/:saleSessionId/:idUser', isLoggedIn, controller.getAllForSaleGamesForNonUser);

    // Routes POST
    router.post('/games', isLoggedIn, isGestionnaire, controller.createGame);
    router.post('/sellGame', isLoggedIn, isGestionnaire, controller.sellGame);

    // Routes PATCH
    router.patch('/games/:id', isLoggedIn, isGestionnaire, controller.updateGame); 
    router.patch('/purchaseGame/:id', isLoggedIn, isGestionnaire, controller.purchaseGame);

    // Routes DELETE
    router.delete('/games/:id', isLoggedIn, isGestionnaire, controller.deleteGame); 

    app.use('/depot', router);
};
