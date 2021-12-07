module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID} = DataTypes;
  const ListPermitTypes = sequelize.define(
    'list_permit_types',
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
      permit_type_ndx: {
        type: TEXT,
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
