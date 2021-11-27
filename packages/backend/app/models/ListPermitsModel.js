module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, BOOLEAN} = DataTypes;
  const ListPermits = sequelize.define(
    'list_permits',
    {
      permit_ndx: {
        type: INTEGER,
      },
      permit_type_ndx: {
        type: INTEGER,
      },
      permit_prefix: {
        type: TEXT,
      },
      permit_id: {
        type: TEXT,
      },
      permit_notes: {
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

  ListPermits.associate = function (models) {
    /* Core Associations */
    ListPermits.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    ListPermits.hasMany(models.list_permits, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    ListPermits.belongsTo(models.list_permits, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return ListPermits;
};
