module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, REAL, DATE} = DataTypes;
  const Wells = sequelize.define(
    'wells',
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
      gw_elev: {
        type: INTEGER,
      },
      ft_amsl: {
        type: INTEGER,
      },
      no2_conc: {
        type: REAL,
      },
      region_id: {
        type: UUID,
      },
      well_type_id: {
        type: UUID,
      },
      last_measured: {
        type: DATE,
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

  Wells.associate = function (models) {
    Wells.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    Wells.hasMany(models.wells, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    Wells.belongsTo(models.wells, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
    Wells.belongsTo(models.regions, {
      foreignKey: 'region_id',
      as: 'region',
    });
    Wells.belongsTo(models.well_types, {
      foreignKey: 'well_type_id',
      as: 'well_type',
    });
    Wells.hasMany(models.measurements, {
      foreignKey: 'well_id',
      as: 'measurements',
    });
  };

  return Wells;
};
