module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, BOOLEAN} = DataTypes;
  const DmAggregateSystems = sequelize.define(
    'dm_aggregate_systems',
    {
      agg_system_ndx: {
        type: INTEGER,
      },
      agg_system_name: {
        type: TEXT,
      },
      agg_system_notes: {
        type: TEXT,
      },
      inactive: {
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
        type: TEXT,
      },
      updated_by: {
        type: TEXT,
      },
      deleted_by: {
        type: TEXT,
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

  DmAggregateSystems.associate = function (models) {
    /* Core Associations */
    DmAggregateSystems.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    DmAggregateSystems.hasMany(models.dm_aggregate_systems, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    DmAggregateSystems.belongsTo(models.dm_aggregate_systems, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return DmAggregateSystems;
};
