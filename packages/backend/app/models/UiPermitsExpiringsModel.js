module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, DATE} = DataTypes;
  const UiPermitsExpirings = sequelize.define(
    'ui_permits_expirings',
    {
      permit_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      permit_number: {
        type: TEXT,
      },
      exp_status: {
        type: TEXT,
      },
      permit_year: {
        type: INTEGER,
      },
      permitted_value: {
        type: NUMBER,
      },
      agg_system_name: {
        type: TEXT,
      },
      permitted_use: {
        type: TEXT,
      },
      permit_holder: {
        type: TEXT,
      },
      expiration_date: {
        type: DATE,
      },
      assoc_wells: {
        type: TEXT,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return UiPermitsExpirings;
};
