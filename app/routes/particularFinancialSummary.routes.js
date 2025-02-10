const controller = require('../controllers/particularFinancialSummary.controllers');
const { isLoggedIn, isGestionnaire } = require('../middlewares/auth');

module.exports = (app) => {
    const router = require('express').Router();

    // Route pour créer ou synchroniser un bilan financier particulier
    router.post('/', isLoggedIn, isGestionnaire, controller.createOrSyncFinancialSummary);

    // Route pour récupérer tous les bilans financiers particuliers
    router.get('/', isLoggedIn, isGestionnaire, controller.getAllFinancialSummaries);

    // Route pour récupérer un bilan financier particulier par e-mail
    router.get('/:email', isLoggedIn, isGestionnaire, controller.getFinancialSummaryByEmail);

    // Route pour mettre à jour un bilan financier particulier par e-mail
    router.patch('/:email', isLoggedIn, isGestionnaire, controller.updateFinancialSummary);

    // Route pour supprimer un bilan financier particulier par e-mail
    router.delete('/:email', isLoggedIn, isGestionnaire, controller.deleteFinancialSummary);

    app.use('/particularFinancialSummary', router);
};
