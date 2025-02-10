module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transaction', {
        idTransaction: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        saleSessionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        sellerId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        gameId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        buyerId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        totalAmount: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        commissionAmount: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        sellerEarnings: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    });

    return Transaction;
};
