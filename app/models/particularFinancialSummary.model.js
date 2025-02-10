module.exports = (sequelize, Sequelize) => {
    const ParticularFinancialSummary = sequelize.define('particularFinancialSummary', {
        idSummary: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        totalEarnings: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        totalDue: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
        totalGamesDeposited: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        totalGamesSold: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });

    return ParticularFinancialSummary;
};
