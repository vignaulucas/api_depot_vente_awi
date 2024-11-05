const { Game, TemporarySeller, SaleSession } = require('../models');
const { Op } = require('sequelize');

// Créer un nouveau jeu et l'associer à un vendeur temporaire ou un utilisateur existant
const createGame = async (req, res) => {
    console.log(req.body);
    const { name, publisher, price, uniqueIdentifier, status, saleSessionId, sellerId, userId } = req.body;

    try {
        if (!userId && !sellerId) {
            return res.status(400).send({ message: 'Aucun vendeur sélectionné. Veuillez sélectionner un vendeur existant ou entrer les informations d’un vendeur temporaire.' });
        }

        const game = await Game.create({
            name,
            publisher,
            price,
            uniqueIdentifier,
            status,
            saleSessionId,
            sellerId: sellerId || null, // Ajoute `sellerId` pour le temporary seller
            userId: userId || null,     // Ajoute `userId` pour l'utilisateur existant
        });

        res.status(201).send(game);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la création du jeu', error: error.message });
    }
};



// Récupérer tous les jeux
const getAllGames = async (req, res) => {
    try {
        const games = await Game.findAll();
        res.send(games);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération des jeux', error: error.message });
    }
};

// Récupérer un jeu par ID
const getGameById = async (req, res) => {
    const { id } = req.params;

    try {
        const game = await Game.findByPk(id);
        if (!game) return res.status(404).send({ message: 'Jeu non trouvé' });

        res.send(game);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération du jeu', error: error.message });
    }
};

// Mettre à jour un jeu
const updateGame = async (req, res) => {
    const { id } = req.params;
    const { title, publisher, price, depositFee } = req.body;

    try {
        const game = await Game.findByPk(id);
        if (!game) return res.status(404).send({ message: 'Jeu non trouvé' });

        game.title = title ?? game.title;
        game.publisher = publisher ?? game.publisher;
        game.price = price ?? game.price;
        game.depositFee = depositFee ?? game.depositFee;

        await game.save();
        res.send({ message: 'Jeu mis à jour avec succès', game });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la mise à jour du jeu', error: error.message });
    }
};

// Supprimer un jeu
const deleteGame = async (req, res) => {
    const { id } = req.params;

    try {
        const game = await Game.findByPk(id);
        if (!game) return res.status(404).send({ message: 'Jeu non trouvé' });

        await game.destroy();
        res.send({ message: 'Jeu supprimé avec succès' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la suppression du jeu', error: error.message });
    }
};

// Récupérer tous les jeux d'un utilisateur spécifique
const getGamesBySeller = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const games = await Game.findAll({
            where: { TemporarySellerId: sellerId }
        });
        if (!games || games.length === 0) return res.status(404).send({ message: 'Aucun jeu trouvé pour ce vendeur' });

        res.send(games);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération des jeux du vendeur', error: error.message });
    }
};

module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    getGamesBySeller
};
