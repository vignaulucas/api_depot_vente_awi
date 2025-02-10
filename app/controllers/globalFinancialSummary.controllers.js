const { GlobalFinancialSummary } = require('../models');

// Créer un résumé financier global
const createGlobalFinancialSummary = async (req, res) => {
    try {
        const { saleSessionId, totalTreasury, totalCommission, totalDepositFees, totalDueToSellers } = req.body;

        const newSummary = await GlobalFinancialSummary.create({
            saleSessionId,
            totalTreasury,
            totalCommission,
            totalDepositFees,
            totalDueToSellers,
        });

        res.status(201).send(newSummary);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la création du résumé financier global.', error: error.message });
    }
};

// Récupérer tous les résumés financiers globaux
const getAllGlobalFinancialSummaries = async (req, res) => {
    try {
        const summaries = await GlobalFinancialSummary.findAll();
        res.send(summaries);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération des résumés financiers globaux.', error: error.message });
    }
};

// Récupérer un résumé financier global par ID
const getGlobalFinancialSummaryById = async (req, res) => {
    try {
        const summary = await GlobalFinancialSummary.findByPk(req.params.idSummary);

        if (!summary) return res.status(404).send({ message: 'Résumé financier global introuvable.' });

        res.send(summary);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération du résumé financier global.', error: error.message });
    }
};

// Récupérer un résumé financier global par saleSessionId
const getGlobalFinancialSummaryBySaleSessionId = async (req, res) => {
    try {
        const summary = await GlobalFinancialSummary.findOne({
            where: { saleSessionId: req.params.saleSessionId },
        });

        if (!summary) return res.status(404).send({ message: 'Résumé financier global introuvable.' });

        res.send(summary);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération du résumé financier global.', error: error.message });
    }
};

// Mettre à jour un résumé financier global
const updateGlobalFinancialSummary = async (req, res) => {
    try {
        const summary = await GlobalFinancialSummary.findByPk(req.params.idSummary);

        if (!summary) return res.status(404).send({ message: 'Résumé financier global introuvable.' });

        const { totalTreasury, totalCommission, totalDepositFees, totalDueToSellers } = req.body;

        summary.totalTreasury = totalTreasury ?? summary.totalTreasury;
        summary.totalCommission = totalCommission ?? summary.totalCommission;
        summary.totalDepositFees = totalDepositFees ?? summary.totalDepositFees;
        summary.totalDueToSellers = totalDueToSellers ?? summary.totalDueToSellers;

        await summary.save();
        res.send(summary);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la mise à jour du résumé financier global.', error: error.message });
    }
};

// Supprimer un résumé financier global
const deleteGlobalFinancialSummary = async (req, res) => {
    try {
        const summary = await GlobalFinancialSummary.findByPk(req.params.idSummary);

        if (!summary) return res.status(404).send({ message: 'Résumé financier global introuvable.' });

        await summary.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la suppression du résumé financier global.', error: error.message });
    }
};

module.exports = {
    createGlobalFinancialSummary,
    getAllGlobalFinancialSummaries,
    getGlobalFinancialSummaryById,
    getGlobalFinancialSummaryBySaleSessionId,
    updateGlobalFinancialSummary,
    deleteGlobalFinancialSummary,
};
