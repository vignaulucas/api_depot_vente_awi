const { TemporaryBuyer } = require('../models');

const createTemporaryBuyer = async (req, res) => {
    try {
        const { firstName, lastName, email, telephone, ville, postalCode, addresse } = req.body;

        // Vérifier si un acheteur temporaire avec cet email existe déjà
        const existingBuyer = await TemporaryBuyer.findOne({ where: { email } });
        if (existingBuyer) {
            // Retourner un code 200 avec l'ID de l'utilisateur existant
            return res.status(200).send({
                message: "Un acheteur temporaire avec cet email existe déjà.",
                temporaryBuyer: existingBuyer, // renvoie le acheteur existant
            });
        }

        // Créer un nouveau acheteur temporaire
        const temporaryBuyer = await TemporaryBuyer.create({
            firstName,
            lastName,
            email,
            telephone,
            ville,
            postalCode,
            addresse,
        });

        res.status(201).send({
            message: 'acheteur temporaire créé avec succès',
            temporaryBuyer,
        });
    } catch (error) {
        console.error("Erreur lors de la création du acheteur temporaire :", error);
        res.status(500).send({
            message: 'Erreur lors de la création du acheteur temporaire',
            error: error.message,
        });
    }
};



// Récupérer tous les acheteurs temporaires
const getAllTemporaryBuyers = async (req, res) => {
    try {
        const temporaryBuyers = await TemporaryBuyer.findAll();
        res.send(temporaryBuyers);
    } catch (error) {
        console.error("Erreur lors de la récupération des acheteurs temporaires :", error);
        res.status(500).send({ message: 'Erreur lors de la récupération des acheteurs temporaires', error: error.message });
    }
};

// Récupérer un acheteur temporaire par ID
const getTemporaryBuyerById = async (req, res) => {
    try {
        const { id } = req.params;
        const temporaryBuyer = await TemporaryBuyer.findByPk(id);
        if (!temporaryBuyer) {
            return res.status(404).send({ message: 'acheteur temporaire non trouvé' });
        }
        res.send(temporaryBuyer);
    } catch (error) {
        console.error("Erreur lors de la récupération du acheteur temporaire :", error);
        res.status(500).send({ message: 'Erreur lors de la récupération du acheteur temporaire', error: error.message });
    }
};

// Mettre à jour les informations d'un acheteur temporaire
const updateTemporaryBuyer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        
        const temporaryBuyer = await TemporaryBuyer.findByPk(id);
        if (!temporaryBuyer) {
            return res.status(404).send({ message: 'acheteur temporaire non trouvé' });
        }

        await temporaryBuyer.update({ name, email, phone, address });
        res.send({ message: 'acheteur temporaire mis à jour avec succès', temporaryBuyer });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du acheteur temporaire :", error);
        res.status(500).send({ message: 'Erreur lors de la mise à jour du acheteur temporaire', error: error.message });
    }
};

// Supprimer un acheteur temporaire par ID
const deleteTemporaryBuyer = async (req, res) => {
    try {
        const { id } = req.params;
        
        const temporaryBuyer = await TemporaryBuyer.findByPk(id);
        if (!temporaryBuyer) {
            return res.status(404).send({ message: 'acheteur temporaire non trouvé' });
        }

        await temporaryBuyer.destroy();
        res.send({ message: 'acheteur temporaire supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression du acheteur temporaire :", error);
        res.status(500).send({ message: 'Erreur lors de la suppression du acheteur temporaire', error: error.message });
    }
};

module.exports = {
    createTemporaryBuyer,
    getAllTemporaryBuyers,
    getTemporaryBuyerById,
    updateTemporaryBuyer,
    deleteTemporaryBuyer,
};
