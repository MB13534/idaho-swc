module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, DOUBLE} = DataTypes;
  const Regions = sequelize.define(
    'regions',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      parent_id: {
        type: UUID,
      },
      former_parent_id: {
        type: UUID,
      },
      status_id: {
        type: INTEGER,
      },
      created_by: {
        type: UUID,
      },
      updated_by: {
        type: UUID,
      },
      deleted_by: {
        type: UUID,
      },
      name: {
        type: TEXT,
      },
      lat: {
        type: DOUBLE,
      },
      lng: {
        type: DOUBLE,
      },
    },
    {
      defaultScope: {
        order: [['created_at', 'asc']],
      },
      schema: 'app',
      paranoid: true,
    }
  );

  Regions.associate = function (models) {
    /* Core Associations */
    Regions.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    Regions.hasMany(models.regions, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    Regions.belongsTo(models.regions, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    Regions.hasMany(models.wells, {
      foreignKey: 'region_id',
      as: 'wells',
    });
    /* App Associations */
  };

  return Regions;
};
