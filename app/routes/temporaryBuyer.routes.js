const controller = require('../controllers/temporaryBuyer.controllers');
const { isLoggedIn, isGestionnaire } = require('../middlewares/auth');

module.exports = (app) => {
    const router = require('express').Router();

    // Route pour créer un nouveau vendeur temporaire
    router.post('/', isLoggedIn, isGestionnaire, controller.createTemporaryBuyer);

    // Route pour récupérer tous les vendeurs temporaires
    router.get('/', isLoggedIn, isGestionnaire, controller.getAllTemporaryBuyers);

    // Route pour récupérer un vendeur temporaire par ID
    router.get('/:id', isLoggedIn, isGestionnaire, controller.getTemporaryBuyerById);

    // Route pour mettre à jour un vendeur temporaire
    router.patch('/:id', isLoggedIn, isGestionnaire, controller.updateTemporaryBuyer);

    // Route pour supprimer un vendeur temporaire
    router.delete('/:id', isLoggedIn, isGestionnaire, controller.deleteTemporaryBuyer);

    app.use('/temporaryBuyer', router);
};
