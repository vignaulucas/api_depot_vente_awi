module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define('Game', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        publisher: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            comment: "Nom de l'éditeur ou du créateur original du jeu",
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        uniqueIdentifier: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            defaultValue: () => `JEU-${Date.now()}`,
            comment: "Identifiant unique généré pour chaque jeu",
        },
        status: {
            type: Sequelize.ENUM('depot', 'en vente', 'vendu', 'retiré'),
            defaultValue: 'depot',
            allowNull: false,
        },
        sellerId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'TemporarySellers',
                key: 'id',
            },
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'idUser',
            },
        },
        depositFee: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        saleSessionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'SaleSessions',
                key: 'id',
            },
            comment: "Référence à la session de vente active lors du dépôt",
        },
    });

    return Game;
};
