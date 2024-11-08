module.exports = (sequelize, Sequelize) => {
    const Wishlist = sequelize.define('Wishlist', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        gameId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Games',
                key: 'id'
            }
        }
    });

    return Wishlist;
};
