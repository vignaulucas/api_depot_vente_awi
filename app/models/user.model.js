const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        idUser: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Must be a valid email"
                },
                async isUnique(value) {
                    if (value !== null) {
                        let existing = await User.findOne({ where: { email: value } });
                        if (existing) {
                            throw new Error('Email already in use!');
                        }
                    }
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        telephone: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        ville: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        postalCode: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        adresse: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        aspiringManager: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        role: {
            type: Sequelize.DataTypes.ENUM('seller', 'admin', 'manager'),
            defaultValue: 'seller',
        },
        resetPasswordToken: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        resetPasswordExpire: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    });

    User.beforeCreate(async user => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        return (user.password = hash);
    });

    return User;
};
