const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const db = {};

const config = {
  dialect: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  logging: false,
  ssl: false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTableName: true,
  },
};

if (process.env.PG_ENABLE === 'true') {
  const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USERNAME,
    process.env.PG_PASSWORD,
    config
  );

  const loadModels = (rootPath) => {
    fs.readdirSync(rootPath)
      .filter((file) => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
        );
      })
      .forEach((file) => {
        const model = require(path.join(rootPath, file))(
          sequelize,
          Sequelize.DataTypes
        );
        db[model.name] = model;
      });
  };

  // Load Core Modules
  loadModels(__dirname);

  // Load App Modules
  loadModels(path.join(__dirname, '../../app/models/'));

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.log('Unable to connect to the database:', err);
    });

  Sequelize.postgres.DECIMAL.parse = function (value) {
    return parseFloat(value);
  };
  Sequelize.postgres.BIGINT.parse = function (value) {
    return parseInt(value);
  };
}

module.exports = db;
