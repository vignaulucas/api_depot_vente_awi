const controller = require('../controllers/transaction.controllers');
const { isLoggedIn, isGestionnaire } = require('../middlewares/auth');

module.exports = (app) => {
    const router = require('express').Router();

    // Route pour créer une nouvelle transaction
    router.post('/', isLoggedIn, isGestionnaire, controller.createTransaction);

    // Route pour récupérer toutes les transactions
    router.get('/', isLoggedIn, isGestionnaire, controller.getAllTransactions);

    // Route pour récupérer une transaction par ID
    router.get('/:transactionId', isLoggedIn, controller.getTransactionById);

    // Route pour récupérer toutes les transactions d'un vendeur
    router.get('/seller/:sellerId', isLoggedIn, isGestionnaire, controller.getTransactionsBySeller);

    // Route pour récupérer toutes les transactions d'un acheteur
    router.get('/buyer/:buyerId', isLoggedIn, controller.getTransactionsByBuyer);

    // Route pour récupérer toutes les transactions d'une session de vente
    router.get('/session/:saleSessionId', isLoggedIn, isGestionnaire, controller.getTransactionsBySession);

    app.use('/transactions', router);
};
