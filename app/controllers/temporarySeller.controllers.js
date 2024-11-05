const { TemporarySeller } = require('../models');

const createTemporarySeller = async (req, res) => {
    try {
        const { firstName, lastName, email, telephone, ville, postalCode, addresse } = req.body;

        // Vérifier si un vendeur temporaire avec cet email existe déjà
        const existingSeller = await TemporarySeller.findOne({ where: { email } });
        if (existingSeller) {
            // Retourner un code 200 avec l'ID de l'utilisateur existant
            return res.status(200).send({
                message: "Un vendeur temporaire avec cet email existe déjà.",
                temporarySeller: existingSeller, // renvoie le vendeur existant
            });
        }

        // Créer un nouveau vendeur temporaire
        const temporarySeller = await TemporarySeller.create({
            firstName,
            lastName,
            email,
            telephone,
            ville,
            postalCode,
            addresse,
        });

        res.status(201).send({
            message: 'Vendeur temporaire créé avec succès',
            temporarySeller,
        });
    } catch (error) {
        console.error("Erreur lors de la création du vendeur temporaire :", error);
        res.status(500).send({
            message: 'Erreur lors de la création du vendeur temporaire',
            error: error.message,
        });
    }
};



// Récupérer tous les vendeurs temporaires
const getAllTemporarySellers = async (req, res) => {
    try {
        const temporarySellers = await TemporarySeller.findAll();
        res.send(temporarySellers);
    } catch (error) {
        console.error("Erreur lors de la récupération des vendeurs temporaires :", error);
        res.status(500).send({ message: 'Erreur lors de la récupération des vendeurs temporaires', error: error.message });
    }
};

// Récupérer un vendeur temporaire par ID
const getTemporarySellerById = async (req, res) => {
    try {
        const { id } = req.params;
        const temporarySeller = await TemporarySeller.findByPk(id);
        if (!temporarySeller) {
            return res.status(404).send({ message: 'Vendeur temporaire non trouvé' });
        }
        res.send(temporarySeller);
    } catch (error) {
        console.error("Erreur lors de la récupération du vendeur temporaire :", error);
        res.status(500).send({ message: 'Erreur lors de la récupération du vendeur temporaire', error: error.message });
    }
};

// Mettre à jour les informations d'un vendeur temporaire
const updateTemporarySeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        
        const temporarySeller = await TemporarySeller.findByPk(id);
        if (!temporarySeller) {
            return res.status(404).send({ message: 'Vendeur temporaire non trouvé' });
        }

        await temporarySeller.update({ name, email, phone, address });
        res.send({ message: 'Vendeur temporaire mis à jour avec succès', temporarySeller });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du vendeur temporaire :", error);
        res.status(500).send({ message: 'Erreur lors de la mise à jour du vendeur temporaire', error: error.message });
    }
};

// Supprimer un vendeur temporaire par ID
const deleteTemporarySeller = async (req, res) => {
    try {
        const { id } = req.params;
        
        const temporarySeller = await TemporarySeller.findByPk(id);
        if (!temporarySeller) {
            return res.status(404).send({ message: 'Vendeur temporaire non trouvé' });
        }

        await temporarySeller.destroy();
        res.send({ message: 'Vendeur temporaire supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression du vendeur temporaire :", error);
        res.status(500).send({ message: 'Erreur lors de la suppression du vendeur temporaire', error: error.message });
    }
};

module.exports = {
    createTemporarySeller,
    getAllTemporarySellers,
    getTemporarySellerById,
    updateTemporarySeller,
    deleteTemporarySeller,
};
