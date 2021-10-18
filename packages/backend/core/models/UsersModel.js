module.exports = (sequelize, DataTypes) => {
  const {TEXT, BOOLEAN} = DataTypes;
  const Model = sequelize.define(
    'users',
    {
      id: {
        type: TEXT,
        primaryKey: true,
      },
      email: {
        type: TEXT,
        validate: {
          notEmpty: true,
        },
      },
      picture: {
        type: TEXT,
      },
      active: {
        type: BOOLEAN,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      defaultScope: {
        where: {
          active: true,
        },
      },
      schema: 'web',
      paranoid: true,
    }
  );

  /*
  Examples.associate = function(models) {
    Examples.belongsTo(models.ExampleTypes, { foreignKey: 'example_type_id' });
    Examples.belongsToMany(models.Locations, {
      through: 'ExamplesLocations',
      foreignKey: 'example_id',
      otherKey: 'location_id',
      timestamps: false,
      as: 'Locations',
    });
    Examples.hasMany(models.Orders, {
      foreignKey: 'example_id',
      timestamps: false,
      as: 'Orders'
    });
  };
  */

  return Model;
};
