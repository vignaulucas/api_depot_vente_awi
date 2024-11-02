// saleSession.model.js
module.exports = (sequelize, Sequelize) => {
    const SaleSession = sequelize.define('SaleSession', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        depositFee: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
            comment: "Montant fixe ou pourcentage pour les frais de dépôt",
        },
        depositFeeType: {
            type: Sequelize.ENUM('fixed', 'percentage'),
            allowNull: false,
            comment: "Type de frais de dépôt : fixe ou en pourcentage",
        },
        commissionRate: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
            comment: "Commission en pourcentage appliquée aux ventes",
        }
    });

    // Définition d'une propriété virtuelle pour vérifier si la session est active
    SaleSession.prototype.isActive = function () {
        const now = new Date();
        return now >= this.startDate && now <= this.endDate;
    };

    return SaleSession;
};
