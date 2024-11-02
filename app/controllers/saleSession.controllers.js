const { SaleSession } = require('../models');
const { Op } = require('sequelize');

// Récupérer toutes les sessions de vente
const getAllSessions = async (req, res) => {
    try {
        const sessions = await SaleSession.findAll();
        res.send(sessions);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération des sessions de vente', error: error.message });
    }
};

// Récupérer une session de vente spécifique par ID
const getSessionById = async (req, res) => {
    try {
        const session = await SaleSession.findByPk(req.params.id);
        if (!session) return res.status(404).send({ message: 'Session non trouvée' });
        res.send(session);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération de la session', error: error.message });
    }
};

const getActiveSession = async (req, res) => {
    try {
        const now = new Date();
        const session = await SaleSession.findOne({
            where: {
                startDate: { [Sequelize.Op.lte]: now },
                endDate: { [Sequelize.Op.gte]: now }
            }
        });

        if (!session) return res.status(404).send({ message: "Aucune session active actuellement" });

        res.send(session);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération de la session active", error: error.message });
    }
};

// Créer une nouvelle session de vente
const createSession = async (req, res) => {
    const { startDate, endDate, depositFee, depositFeeType, commissionRate } = req.body;

    try {
        // Vérifie s'il existe déjà une session avec des dates chevauchantes
        const overlappingSession = await SaleSession.findOne({
            where: {
                [Op.or]: [
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } },
                    { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } }
                ]
            }
        });

        if (overlappingSession) {
            return res.status(400).send({ message: 'Une session active existe déjà sur cette période.' });
        }

        // Crée la nouvelle session
        const session = await SaleSession.create({
            startDate,
            endDate,
            depositFee,
            depositFeeType, // "fixed" ou "percentage"
            commissionRate,
        });

        res.status(201).send({ message: 'Session créée avec succès', session });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la création de la session', error: error.message });
    }
};

// Mettre à jour une session existante
const updateSession = async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, depositFee, depositFeeType, commissionRate } = req.body;
    try {
        const session = await SaleSession.findByPk(id);
        if (!session) return res.status(404).send({ message: 'Session non trouvée' });

        // Vérifie si les nouvelles dates ne chevauchent pas une autre session
        const overlappingSession = await SaleSession.findOne({
            where: {
                id: { [Op.ne]: id },
                [Op.or]: [
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } },
                    { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } }
                ]
            }
        });

        if (overlappingSession) {
            return res.status(400).send({ message: 'Une autre session chevauche ces dates.' });
        }

        // Mise à jour des informations de la session
        session.startDate = startDate || session.startDate;
        session.endDate = endDate || session.endDate;
        session.depositFee = depositFee || session.depositFee;
        session.depositFeeType = depositFeeType || session.depositFeeType;
        session.commissionRate = commissionRate || session.commissionRate;

        await session.save();
        res.send({ message: 'Session mise à jour avec succès', session });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la mise à jour de la session', error: error.message });
    }
};

// Désactiver une session en changeant ses dates pour qu'elle soit inactive
const deactivateSession = async (req, res) => {
    const { id } = req.params;
    try {
        const session = await SaleSession.findByPk(id);
        if (!session) return res.status(404).send({ message: 'Session non trouvée' });

        session.endDate = new Date();
        await session.save();
        res.send({ message: 'Session désactivée avec succès' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la désactivation de la session', error: error.message });
    }
};

const deleteUpcomingSession = async (req, res) => {
    const { id } = req.params;

    try {
        const session = await SaleSession.findByPk(id);

        // Vérifiez que la session existe et qu'elle est à venir
        if (!session) {
            return res.status(404).send({ message: 'Session non trouvée' });
        }

        if (new Date(session.startDate) <= new Date()) {
            return res.status(400).send({ message: 'Seules les sessions à venir peuvent être supprimées' });
        }

        // Supprimez la session
        await session.destroy();
        res.send({ message: 'Session supprimée avec succès' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la suppression de la session', error: error.message });
    }
};

module.exports = { getAllSessions, getSessionById, getActiveSession, createSession, updateSession, deactivateSession, deleteUpcomingSession };
