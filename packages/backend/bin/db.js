const Sequelize = require('sequelize');
const output = require('./logger');
const log = {...output()};

const db = {};

const config = {
  dialect: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  logging: false,
  ssl: false,
  dialectOptions: {
    options: {
      requestTimeout: 1000,
    },
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTableName: true,
  },
};

const connect = async () => {
  const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USERNAME,
    process.env.PG_PASSWORD,
    config
  );

  await sequelize
    .authenticate()
    .then(() => {
      log.info('Connected to database successfully.');
    })
    .catch((err) => {
      log.error('Unable to connect to database.', err);
    });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  Sequelize.postgres.DECIMAL.parse = function (value) {
    return parseFloat(value);
  };
  Sequelize.postgres.BIGINT.parse = function (value) {
    return parseInt(value);
  };

  return db;
};

module.exports = {
  connect,
};
