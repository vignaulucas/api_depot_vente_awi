const { ParticularFinancialSummary } = require('../models');

// Créer ou synchroniser un bilan financier particulier
const createOrSyncFinancialSummary = async (req, res) => {
    try {
        const { email, totalEarnings = 0, totalDue = 0, totalGamesDeposited = 0, totalGamesSold = 0 } = req.body;

        // Vérifier si un résumé existe déjà pour cet email
        const existingSummary = await ParticularFinancialSummary.findOne({ where: { email } });
        if (existingSummary) {
            // Synchroniser les données existantes
            await existingSummary.update({
                totalEarnings: totalEarnings || existingSummary.totalEarnings,
                totalDue: totalDue || existingSummary.totalDue,
                totalGamesDeposited: totalGamesDeposited || existingSummary.totalGamesDeposited,
                totalGamesSold: totalGamesSold || existingSummary.totalGamesSold,
            });

            return res.status(200).send({
                message: 'Résumé financier particulier synchronisé avec succès',
                particularFinancialSummary: existingSummary,
            });
        }

        // Créer un nouveau résumé
        const newSummary = await ParticularFinancialSummary.create({
            email,
            totalEarnings,
            totalDue,
            totalGamesDeposited,
            totalGamesSold,
        });

        res.status(201).send({
            message: 'Résumé financier particulier créé avec succès',
            particularFinancialSummary: newSummary,
        });
    } catch (error) {
        console.error("Erreur lors de la synchronisation du résumé financier particulier :", error);
        res.status(500).send({
            message: 'Erreur lors de la synchronisation du résumé financier particulier',
            error: error.message,
        });
    }
};

// Récupérer tous les bilans financiers particuliers
const getAllFinancialSummaries = async (req, res) => {
    try {
        const financialSummaries = await ParticularFinancialSummary.findAll();
        res.send(financialSummaries);
    } catch (error) {
        console.error("Erreur lors de la récupération des bilans financiers particuliers :", error);
        res.status(500).send({ message: 'Erreur lors de la récupération des bilans financiers particuliers', error: error.message });
    }
};

// Récupérer un bilan financier particulier par e-mail
const getFinancialSummaryByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const financialSummary = await ParticularFinancialSummary.findOne({ where: { email } });

        if (!financialSummary) {
            return res.status(404).send({ message: 'Résumé financier particulier non trouvé' });
        }

        res.send(financialSummary);
    } catch (error) {
        console.error("Erreur lors de la récupération du résumé financier particulier :", error);
        res.status(500).send({ message: 'Erreur lors de la récupération du résumé financier particulier', error: error.message });
    }
};

// Mettre à jour un bilan financier particulier
const updateFinancialSummary = async (req, res) => {
    try {
        const { email } = req.params;
        const updates = req.body;

        const financialSummary = await ParticularFinancialSummary.findOne({ where: { email } });
        if (!financialSummary) {
            return res.status(404).send({ message: 'Résumé financier particulier non trouvé' });
        }

        await financialSummary.update(updates);
        res.send({
            message: 'Résumé financier particulier mis à jour avec succès',
            particularFinancialSummary: financialSummary,
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du résumé financier particulier :", error);
        res.status(500).send({ message: 'Erreur lors de la mise à jour du résumé financier particulier', error: error.message });
    }
};

// Supprimer un bilan financier particulier par e-mail
const deleteFinancialSummary = async (req, res) => {
    try {
        const { email } = req.params;

        const financialSummary = await ParticularFinancialSummary.findOne({ where: { email } });
        if (!financialSummary) {
            return res.status(404).send({ message: 'Résumé financier particulier non trouvé' });
        }

        await financialSummary.destroy();
        res.send({ message: 'Résumé financier particulier supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression du résumé financier particulier :", error);
        res.status(500).send({ message: 'Erreur lors de la suppression du résumé financier particulier', error: error.message });
    }
};

module.exports = {
    createOrSyncFinancialSummary,
    getAllFinancialSummaries,
    getFinancialSummaryByEmail,
    updateFinancialSummary,
    deleteFinancialSummary,
};
