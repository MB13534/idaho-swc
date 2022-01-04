module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, NUMBER, DATE, BOOLEAN, ARRAY} = DataTypes;
  const DmPermits = sequelize.define(
    'dm_permits',
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
      permit_number: {
        type: TEXT,
      },
      permit_year: {
        type: INTEGER,
      },
      agg_system_ndx: {
        type: INTEGER,
      },
      permitted_value: {
        type: NUMBER,
      },
      use_ndx: {
        type: INTEGER,
      },
      expiration_date: {
        type: DATE,
      },
      permit_terms_ndx: {
        type: INTEGER,
      },
      notes: {
        type: TEXT,
      },
      exportable: {
        type: BOOLEAN,
      },
      exportable_amount: {
        type: NUMBER,
      },
      permit_data_ndx: {
        type: INTEGER,
      },
      assoc_wells: {
        type: ARRAY(TEXT),
      },
      assoc_well_ndx: {
        type: ARRAY(INTEGER),
      },
      rolo_ndx: {
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

  DmPermits.associate = function (models) {
    /* Core Associations */
    DmPermits.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    DmPermits.hasMany(models.dm_permits, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    DmPermits.belongsTo(models.dm_permits, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
    /* App Associations */
  };

  return DmPermits;
};
