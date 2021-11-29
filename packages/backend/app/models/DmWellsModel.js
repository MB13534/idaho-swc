module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, NUMBER, BOOLEAN, DATE} = DataTypes;
  const DmWells = sequelize.define(
    'dm_wells',
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
      well_name: {
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
      well_notes: {
        type: TEXT,
      },
      aquifer_ndx: {
        type: INTEGER,
      },
      date_drilled: {
        type: DATE,
      },
      drillers_log: {
        type: BOOLEAN,
      },
      well_depth_ft: {
        type: NUMBER,
      },
      screen_top_depth_ft: {
        type: NUMBER,
      },
      screen_bottom_depth_ft: {
        type: NUMBER,
      },
      construction_notes: {
        type: TEXT,
      },
      well_status_ndx: {
        type: INTEGER,
      },
      exempt: {
        type: BOOLEAN,
      },
      primary_well_use_ndx: {
        type: INTEGER,
      },
      secondary_well_use_ndx: {
        type: INTEGER,
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

  DmWells.associate = function (models) {
    /* Core Associations */
    DmWells.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    DmWells.hasMany(models.dm_wells, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    DmWells.belongsTo(models.dm_wells, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return DmWells;
};
