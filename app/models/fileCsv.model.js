module.exports = (sequelize, Sequelize) => {
    const Csv = sequelize.define('Csv', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      idJeu: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nameGame: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      author: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      editor: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      nbPlayers: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      minAge: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      duration: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notice: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      mechanisms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      themes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      logo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      video: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  
    return Csv;
  };
