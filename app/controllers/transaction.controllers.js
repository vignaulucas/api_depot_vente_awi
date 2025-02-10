const { Transaction, Game, User, TemporaryBuyer, sequelize } = require('../models');
const { Op } = require('sequelize');

// Créer une transaction
const createTransaction = async (req, res) => {
    const {
        saleSessionId,
        userId,
        sellerId,
        gameId,
        buyerId,
        totalAmount,
        commissionAmount,
        sellerEarnings
    } = req.body;

    try {
        const transaction = await Transaction.create({
            saleSessionId,
            userId,
            sellerId,
            gameId,
            buyerId,
            totalAmount,
            commissionAmount,
            sellerEarnings
        });

        res.status(201).json({ message: 'Transaction créée avec succès', transaction });
    } catch (error) {
        console.error('Erreur lors de la création de la transaction:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la transaction.', error: error.message });
    }
};

// Récupérer toutes les transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                { model: Game },
                { model: User, as: 'Buyer' },
                { model: User, as: 'Seller' },
                { model: TemporaryBuyer }
            ]
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des transactions.', error: error.message });
    }
};

// Récupérer une transaction par ID
const getTransactionById = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findOne({
            where: { idTransaction: transactionId },
            include: [
                { model: Game },
                { model: User, as: 'Buyer' },
                { model: User, as: 'Seller' },
                { model: TemporaryBuyer }
            ]
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction introuvable.' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Erreur lors de la récupération de la transaction:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la transaction.', error: error.message });
    }
};

// Récupérer les transactions pour un vendeur
const getTransactionsBySeller = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const transactions = await Transaction.findAll({
            where: { sellerId },
            include: [{ model: Game }]
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions pour le vendeur:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des transactions.', error: error.message });
    }
};

// Récupérer les transactions pour un acheteur
const getTransactionsByBuyer = async (req, res) => {
    const { buyerId } = req.params;

    try {
        const transactions = await Transaction.findAll({
            where: { buyerId },
            include: [{ model: Game }]
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions pour l\'acheteur:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des transactions.', error: error.message });
    }
};

// Récupérer les transactions pour une session spécifique
const getTransactionsBySession = async (req, res) => {
    const { saleSessionId } = req.params;

    try {
        const transactions = await Transaction.findAll({
            where: { saleSessionId },
            include: [{ model: Game }]
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions pour la session:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des transactions.', error: error.message });
    }
};

const getFinancialSummaryBySaleSessionId = async (req, res) => {
    console.log(req.params);
    try {
        const { saleSessionId } = req.params;
        if (!saleSessionId) {
            return res.status(400).send({ message: "Le saleSessionId est requis." });
        }
      
        const summary = await Transaction.findOne({
            where: { saleSessionId },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalTreasury'],
                [sequelize.fn('SUM', sequelize.col('commissionAmount')), 'totalCommission'],
                [sequelize.fn('SUM', sequelize.col('sellerEarnings')), 'totalDueToSellers']
            ],
            raw: true
        });
  
        // Vérification avant d'accéder aux propriétés
        if (!summary) {
            return res.status(404).send({ message: "Aucune transaction trouvée pour cette session." });
        }
  
        const result = {
          totalTreasury: summary.totalTreasury ? Number(summary.totalTreasury) : 0,
          totalCommission: summary.totalCommission ? Number(summary.totalCommission) : 0,
          totalDueToSellers: summary.totalDueToSellers ? Number(summary.totalDueToSellers) : 0
        };
  
        res.status(200).send(result);
    } catch (error) {
        console.error("Erreur lors du calcul du résumé financier", error);
        res.status(500).send({ message: "Erreur lors du calcul du résumé financier", error: error.message });
    }
};


module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    getTransactionsBySeller,
    getTransactionsByBuyer,
    getTransactionsBySession,
    getFinancialSummaryBySaleSessionId,
};
