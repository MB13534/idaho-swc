module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER} = DataTypes;
  const DmWellProductions = sequelize.define(
    'dm_well_productions',
    {
      aquifer_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      report_month: {
        type: INTEGER,
      },
      report_year: {
        type: INTEGER,
      },
      permit_ndx: {
        type: INTEGER,
      },
      production_gallons: {
        type: NUMBER,
      },
      production_notes: {
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

  return DmWellProductions;
};
