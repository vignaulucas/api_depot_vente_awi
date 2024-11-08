const { Game, TemporarySeller, SaleSession, User } = require('../models');
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

// Récupérer tous les jeux en dépôt d'une session active
const getAllDepositGames = async (req, res) => {
    const { saleSessionId } = req.params;

    try {
        // Récupérer les jeux en dépôt pour la session active avec saleSessionId
        const games = await Game.findAll({
            where: { 
                saleSessionId: saleSessionId, 
                status: 'depot'  // Filtrer uniquement les jeux en dépôt
            },
        });

        if (!games || games.length === 0) {
            return res.status(404).send({ message: 'Aucun jeu en dépôt trouvé pour cette session active.' });
        }
        res.send(games);

    } catch (error) {
        console.error('Erreur lors de la récupération des jeux en dépôt:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération des jeux en dépôt', error: error.message });
    }
};


// Récupérer tous les jeux en vente d'une session active
const getAllForSaleGames = async (req, res) => {
    const { saleSessionId } = req.params;

    try {
        const games = await Game.findAll({
            where: { 
                saleSessionId: saleSessionId, 
                status: 'en vente'
            },
        });

        if (!games || games.length === 0) {
            return res.status(404).send({ message: 'Aucun jeu en vente trouvé pour cette session active.' });
        }
        res.send(games);

    } catch (error) {
        console.error('Erreur lors de la récupération des jeux en vente:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération des jeux en vente', error: error.message });
    }
};

// Contrôleur pour vendre un jeu
const sellGame = async (req, res) => {
    const { gameId } = req.body;

    if (!gameId) {
        return res.status(400).send({ message: 'L\'ID du jeu est requis pour cette opération.' });
    }

    try {
        const game = await Game.findByPk(gameId);
        
        if (!game) {
            return res.status(404).send({ message: 'Jeu introuvable.' });
        }

        if (game.status !== 'depot') {
            return res.status(400).send({ message: 'Le jeu doit être en état "depot" pour être mis en vente.' });
        }

        await game.update({ status: 'en vente' });

        res.status(200).send({ message: 'Le jeu a été mis en vente avec succès.', game });
    } catch (error) {
        console.error('Erreur lors de la mise en vente du jeu:', error);
        res.status(500).send({ message: 'Erreur lors de la mise en vente du jeu.', error: error.message });
    }
};

module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    getGamesBySeller,
    getAllDepositGames,
    getAllForSaleGames,
    sellGame,
};
