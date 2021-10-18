module.exports = (sequelize, DataTypes) => {
  const {INTEGER, REAL, UUID, DATE} = DataTypes;
  const Measurements = sequelize.define(
    'measurements',
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
      well_id: {
        type: UUID,
      },
      reading1: {
        type: REAL,
      },
      reading2: {
        type: REAL,
      },
      reading3: {
        type: REAL,
      },
      reading_date: {
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

  Measurements.associate = function (models) {
    /* Core Associations */
    Measurements.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    Measurements.hasMany(models.measurements, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    Measurements.belongsTo(models.measurements, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
    Measurements.belongsTo(models.wells, {
      foreignKey: 'well_id',
      as: 'well',
    });
  };

  return Measurements;
};
