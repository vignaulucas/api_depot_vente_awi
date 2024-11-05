// models/TemporarySeller.model.js
module.exports = (sequelize, Sequelize) => {
    const TemporarySeller = sequelize.define('TemporarySeller', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: {
                args: true,
                msg: "L'email doit être unique.",
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: "L'email n'est pas valide.",
                },
                is: {
                    args: /\S+@\S+\.\S{2,3}/,
                    msg: "L'email doit correspondre au format correct.",
                },
            },
        },
        telephone: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                is: /^\d{10}$/,
            },
        },
        ville: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        postalCode: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        addresse: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });

    return TemporarySeller;
};
