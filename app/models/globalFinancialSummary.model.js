module.exports = (sequelize, Sequelize) => {
    const GlobalFinancialSummary = sequelize.define('globalFinancialSummary', {
        idSummary: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        saleSessionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        totalTreasury: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        totalCommission: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        totalDepositFees: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        totalDueToSellers: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
    });

    return GlobalFinancialSummary;
};
