module.exports = (sequelize, DataTypes) => {
  const {TEXT} = DataTypes;
  const UiReportExemptWellUseSummaries = sequelize.define(
    'ui_report_exempt_well_use_summaries',
    {
      cuwcd_well_number: {
        type: TEXT,
        primaryKey: true,
      },
      exempt: {
        type: TEXT,
      },
      primary_well_use: {
        type: TEXT,
      },
      source_aquifer: {
        type: TEXT,
      },
      well_status: {
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

  return UiReportExemptWellUseSummaries;
};
