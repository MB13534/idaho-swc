module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, DATE, NUMBER, BOOLEAN} = DataTypes;
  const ListWells = sequelize.define(
    'list_wells',
    {
      well_ndx: {
        type: INTEGER,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      state_well_number: {
        type: TEXT,
      },
      longitude_dd: {
        type: NUMBER,
      },
      latitude_dd: {
        type: NUMBER,
      },
      elevation_ftabmsl: {
        type: NUMBER,
      },
      halff_last_edited_by: {
        type: TEXT,
      },
      halff_last_edited_date: {
        type: DATE,
      },
      well_notes: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
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
      created_at: {
        type: DATE,
      },
      created_by: {
        type: UUID,
      },
      updated_at: {
        type: DATE,
      },
      updated_by: {
        type: UUID,
      },
      deleted_at: {
        type: DATE,
      },
      deleted_by: {
        type: UUID,
      },
      id: {
        type: UUID,
        primaryKey: true,
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

  ListWells.associate = function (models) {
    /* Core Associations */
    ListWells.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    ListWells.hasMany(models.list_wells, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    ListWells.belongsTo(models.list_wells, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return ListWells;
};
