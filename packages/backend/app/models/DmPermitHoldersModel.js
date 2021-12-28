module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID} = DataTypes;
  const DmPermitHolders = sequelize.define(
    'dm_permit_holders',
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
      state: {
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
      notes: {
        type: TEXT,
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

  DmPermitHolders.associate = function (models) {
    /* Core Associations */
    DmPermitHolders.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    DmPermitHolders.hasMany(models.dm_permit_holders, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    DmPermitHolders.belongsTo(models.dm_permit_holders, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return DmPermitHolders;
};
