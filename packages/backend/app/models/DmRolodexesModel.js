module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, DATE, BOOLEAN} = DataTypes;
  const DmRolodexes = sequelize.define(
    'dm_rolodexes',
    {
      rolo_ndx: {
        type: INTEGER,
      },
      permit_holder: {
        type: BOOLEAN,
      },
      well_contact: {
        type: BOOLEAN,
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

  DmRolodexes.associate = function (models) {
    /* Core Associations */
    DmRolodexes.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    DmRolodexes.hasMany(models.dm_rolodexes, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    DmRolodexes.belongsTo(models.dm_rolodexes, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return DmRolodexes;
};
