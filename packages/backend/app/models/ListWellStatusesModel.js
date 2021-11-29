module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN} = DataTypes;
  const ListWellStatuses = sequelize.define(
    'list_well_statuses',
    {
      well_status_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      well_status_desc: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      applies_to: {
        type: TEXT,
      },
      display_order: {
        type: INTEGER,
      },
    },
    {
      schema: 'up_common',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return ListWellStatuses;
};
