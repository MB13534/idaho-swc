module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, BIGINT} = DataTypes;
  const GraphWellproductions = sequelize.define(
    'graph_wellproductions',
    {
      well_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      report_year: {
        type: INTEGER,
      },
      report_month: {
        type: INTEGER,
      },
      production_gallons: {
        type: BIGINT,
      },
      production_af: {
        type: NUMBER,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return GraphWellproductions;
};
