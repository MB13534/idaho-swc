module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID} = DataTypes;
  const WellTypes = sequelize.define(
    'well_types',
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
    },
    {
      defaultScope: {
        order: [['created_at', 'asc']],
      },
      schema: 'app',
      paranoid: true,
    }
  );

  WellTypes.associate = function (models) {
    /* Core Associations */
    WellTypes.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    WellTypes.hasMany(models.well_types, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    WellTypes.belongsTo(models.well_types, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
    WellTypes.hasMany(models.wells, {
      foreignKey: 'well_type_id',
      as: 'wells',
    });
  };

  return WellTypes;
};
