const controller = require('../controllers/temporarySeller.controllers');
const { isLoggedIn, isGestionnaire } = require('../middlewares/auth');

module.exports = (app) => {
    const router = require('express').Router();

    // Route pour créer un nouveau vendeur temporaire
    router.post('/', isLoggedIn, isGestionnaire, controller.createTemporarySeller);

    // Route pour récupérer tous les vendeurs temporaires
    router.get('/', isLoggedIn, isGestionnaire, controller.getAllTemporarySellers);

    // Route pour récupérer un vendeur temporaire par ID
    router.get('/:id', isLoggedIn, isGestionnaire, controller.getTemporarySellerById);

    // Route pour mettre à jour un vendeur temporaire
    router.patch('/:id', isLoggedIn, isGestionnaire, controller.updateTemporarySeller);

    // Route pour supprimer un vendeur temporaire
    router.delete('/:id', isLoggedIn, isGestionnaire, controller.deleteTemporarySeller);

    app.use('/temporarySeller', router);
};
