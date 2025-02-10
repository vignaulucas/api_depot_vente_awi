const controller = require('../controllers/globalFinancialSummary.controllers');
const { isLoggedIn, isGestionnaire } = require('../middlewares/auth');

module.exports = (app) => {
    const router = require('express').Router();

    // Route pour créer un résumé financier global
    router.post('/', isLoggedIn, isGestionnaire, controller.createGlobalFinancialSummary);

    // Route pour récupérer tous les résumés financiers globaux
    router.get('/', isLoggedIn, isGestionnaire, controller.getAllGlobalFinancialSummaries);

    // Route pour récupérer un résumé financier global par ID
    router.get('/:idSummary', isLoggedIn, isGestionnaire, controller.getGlobalFinancialSummaryById);

    // Route pour récupérer un résumé financier global par saleSessionID
    router.get('/:idSummary', isLoggedIn, isGestionnaire, controller.getGlobalFinancialSummaryBySaleSessionId);

    // Route pour mettre à jour un résumé financier global
    router.patch('/:idSummary', isLoggedIn, isGestionnaire, controller.updateGlobalFinancialSummary);

    // Route pour supprimer un résumé financier global
    router.delete('/:idSummary', isLoggedIn, isGestionnaire, controller.deleteGlobalFinancialSummary);

    app.use('/globalFinancialSummary', router);
};
