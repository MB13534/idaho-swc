module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, ARRAY, DATE, UUID, BOOLEAN, REAL} = DataTypes;
  const UiReportAllPermits = sequelize.define(
    'ui_report_all_permits',
    {
      permit_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      agg_system_name: {
        type: TEXT,
      },
      permit_holder: {
        type: TEXT,
      },
      permit_number: {
        type: TEXT,
      },
      permit_year: {
        type: INTEGER,
      },
      permitted_value: {
        type: REAL,
      },
      permitted_use: {
        type: TEXT,
      },
      expiration_date: {
        type: DATE,
      },
      assoc_wells: {
        type: ARRAY(TEXT),
      },
      permit_terms: {
        type: TEXT,
      },
      exportable: {
        type: BOOLEAN,
      },
      exportable_amount: {
        type: REAL,
      },
      permit_data_notes: {
        type: TEXT,
      },
      id: {
        type: UUID,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return UiReportAllPermits;
};
