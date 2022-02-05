module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN} = DataTypes;
  const ListPumpingStatuses = sequelize.define(
    'list_pumping_statuses',
    {
      pumping_status_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      pumping_status_desc: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      display_order: {
        type: INTEGER,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return ListPumpingStatuses;
};
