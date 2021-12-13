module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, NUMBER, BOOLEAN, BIGINT} = DataTypes;
  const DataWellProductions = sequelize.define(
    'data_well_productions',
    {
      production_ndx: {
        type: BIGINT,
      },
      well_ndx: {
        type: INTEGER,
      },
      report_month: {
        type: INTEGER,
      },
      report_year: {
        type: INTEGER,
      },
      permit_ndx: {
        type: INTEGER,
      },
      production_gallons: {
        type: NUMBER,
      },
      production_notes: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
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
    },
    {
      defaultScope: {
        order: [['created_at', 'asc']],
      },
      schema: 'client_clearwater',
      paranoid: true,
    }
  );

  DataWellProductions.associate = function (models) {
    /* Core Associations */
    DataWellProductions.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    DataWellProductions.hasMany(models.data_well_productions, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    DataWellProductions.belongsTo(models.data_well_productions, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return DataWellProductions;
};
