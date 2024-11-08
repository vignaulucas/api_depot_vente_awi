const db = require('../models');
const Wishlist = db.Wishlist;
const Game = db.Game;

// Ajouter un jeu à la wishlist de l'utilisateur
const addToWishlist = async (req, res) => {
    const { gameId, userId } = req.body;

    try {
        const [wishlistItem, created] = await Wishlist.findOrCreate({
            where: { userId, gameId }
        });

        if (!created) {
            return res.status(400).json({ message: 'Ce jeu est déjà dans votre wishlist.' });
        }

        res.status(201).json({ message: 'Jeu ajouté à la wishlist.' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout à la wishlist.", error: error.message });
    }
};

const getWishlist = async (req, res) => {
    const userId = req.params.userId; // Assurez-vous que la route définit `userId` dans les paramètres de l'URL

    try {
        const wishlistGames = await Wishlist.findAll({
            where: { userId: userId }
        });
        console.log("wishlistGames:", wishlistGames);
        res.status(200).json(wishlistGames);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la wishlist.", error: error.message });
    }
};


// Supprimer un jeu de la wishlist
const removeFromWishlist = async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user.id;

    try {
        const deleted = await Wishlist.destroy({
            where: { userId, gameId }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Ce jeu n'est pas dans votre wishlist." });
        }

        res.status(200).json({ message: 'Jeu supprimé de la wishlist.' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la wishlist.", error: error.message });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
