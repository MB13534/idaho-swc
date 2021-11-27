module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, DATE, BOOLEAN} = DataTypes;
  const ListRolodexes = sequelize.define(
    'list_rolodexes',
    {
      rolo_ndx: {
        type: INTEGER,
      },
      lastname: {
        type: TEXT,
      },
      firstname: {
        type: TEXT,
      },
      organization: {
        type: TEXT,
      },
      address: {
        type: TEXT,
      },
      city: {
        type: TEXT,
      },
      zipcode: {
        type: TEXT,
      },
      email_1: {
        type: TEXT,
      },
      email_2: {
        type: TEXT,
      },
      phone_1: {
        type: TEXT,
      },
      phone_2: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      notes: {
        type: TEXT,
      },
      createdby: {
        type: TEXT,
      },
      createddate: {
        type: DATE,
      },
      modifiedby: {
        type: TEXT,
      },
      modifiedtimestamp: {
        type: DATE,
      },
      orig_owner_ndx_akas: {
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
    },
    {
      defaultScope: {
        order: [['created_at', 'asc']],
      },
      schema: 'client_clearwater',
      paranoid: true,
    }
  );

  ListRolodexes.associate = function (models) {
    /* Core Associations */
    ListRolodexes.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    ListRolodexes.hasMany(models.list_rolodexes, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    ListRolodexes.belongsTo(models.list_rolodexes, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return ListRolodexes;
};
