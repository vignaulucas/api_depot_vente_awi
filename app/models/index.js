const Sequelize = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

// Paramètres de connexion pour l'environnement local
const localConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  options: {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX, 10),
      min: parseInt(process.env.DB_POOL_MIN, 10),
      acquire: parseInt(process.env.DB_ACQUIRE, 10),
      idle: parseInt(process.env.DB_IDLE, 10),
    },
  },
};

// Paramètres de connexion pour l'environnement Railway (distribué)
const railwayConfig = {
  database: process.env.MYSQLDATABASE,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  options: {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

// Sélectionnez la configuration appropriée en fonction de l'environnement
const dbConfig = isProduction ? railwayConfig : localConfig;

// Initialisez Sequelize avec la configuration sélectionnée
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.options,{
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,

  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 20),
    min: parseInt(process.env.DB_POOL_MIN, 20),
    acquire: parseInt(process.env.DB_ACQUIRE, 20),
    idle: parseInt(process.env.DB_IDLE, 20),
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model')(sequelize, Sequelize);



module.exports = {
  db,
  User: db.users,
};
