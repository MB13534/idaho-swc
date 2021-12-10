module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, BOOLEAN} = DataTypes;
  const ListPermitTypes = sequelize.define(
    'list_permit_types',
    {
      permit_type_ndx: {
        type: INTEGER,
      },
      permit_type_desc: {
        type: TEXT,
      },
      permit_type_notes: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      display_order: {
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

  ListPermitTypes.associate = function (models) {
    /* Core Associations */
    ListPermitTypes.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    ListPermitTypes.hasMany(models.list_permit_types, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    ListPermitTypes.belongsTo(models.list_permit_types, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return ListPermitTypes;
};
