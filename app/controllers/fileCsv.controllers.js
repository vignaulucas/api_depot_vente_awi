const csv = require('csv-parser');
const fs = require('fs');
const db = require('../models');
const Csv = db.Csv;
const { Op } = require('sequelize');

const importCsv = async (req, res) => {
    if (!req.file) {
        console.error('Aucun fichier fourni');
        return res.status(400).json({ error: 'Veuillez fournir un fichier CSV.' });
    }
    const filePath = req.file.path;

    try {
        // Suppression des données existantes
        await Csv.destroy({
            where: {},
            truncate: true
        });
        console.log('Toutes les données existantes ont été supprimées');
    } catch (error) {
        console.error('Erreur lors de la suppression des données existantes:', error);
        return res.status(500).json({ error: 'Erreur lors de la suppression des données existantes' });
    }

    const produitsData = [];

    // Lecture et traitement du fichier CSV
    fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
            const produitData = {
                idJeu: row['idJeu'],
                nameGame: row['Nom du jeu'],
                author: row['Auteur'],
                editor: row['Éditeur'],
                nbPlayers: row['nb joueurs'],
                minAge: row['âge min'],
                duration: row['Durée'],
                type: row['Type'],
                notice: row['Notice'],
                mechanisms: row['Mécanismes'],
                themes: row['Thèmes'],
                tags: row['Tags'],
                description: row['Description'],
                image: row['Image'],
                logo: row['Logo'],
                video: row['Vidéo']
            };
            produitsData.push(produitData);
        })
        .on('end', async () => {
            try {
                // Insertion des nouvelles données dans la base de données
                await Csv.bulkCreate(produitsData);
                console.log('Importation terminée');
                res.json({ message: 'Importation des données CSV terminée avec succès' });
            } catch (error) {
                console.error("Erreur lors de l'insertion des données:", error);
                res.status(500).json({ error: "Erreur lors de l'importation des données CSV" });
            } finally {
                fs.unlink(filePath, err => {
                    if (err) console.error('Erreur lors de la suppression du fichier temporaire:', err);
                });
            }
        })
        .on('error', (error) => {
            console.error('Erreur lors de la lecture du fichier CSV:', error);
            fs.unlink(filePath, err => {
                if (err) console.error('Erreur lors de la suppression du fichier temporaire:', err);
            });
            res.status(500).json({ error: "Erreur lors de l'importation des données CSV" });
        });
};

const getGameDetailsByName = async (req, res) => {
    try {
        console.log(req.params)
        const { name } = req.params;
        console.log(name)
        console.log("name")
        if (!name) {
            return res.status(400).send({ message: "Nom du jeu requis." });
        }

        const game = await Csv.findOne({
            where: {
                nameGame: {
                    [Op.like]: `%${name}%`
                }
            }
        });

        if (!game) {
            return res.status(404).send({ message: "Jeu non trouvé." });
        }

        res.send(game);
    } catch (error) {
        console.error("Erreur lors de la récupération du jeu :", error);
        res.status(500).send({ message: "Erreur lors de la récupération du jeu", error: error.message });
    }
};


// Fonction pour récupérer les données de la table Csv
const getCsv = async (req, res) => {
    try {
        const produits = await Csv.findAll();
        res.setHeader('Content-Type', 'application/json; charset=utf-8'); // Spécifiez l'encodage UTF-8
        res.json(produits);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
};

module.exports = { importCsv, getCsv, getGameDetailsByName };
