module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, BIGINT, DATE} = DataTypes;
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
      report_date: {
        type: DATE,
      },
      production_gallons: {
        type: BIGINT,
      },
      production_af: {
        type: NUMBER,
      },
      o_pumping_gallons: {
        type: BIGINT,
      },
      o_pumping_af: {
        type: NUMBER,
      },
      h_pumping_gallons: {
        type: BIGINT,
      },
      h_pumping_af: {
        type: NUMBER,
      },
      cum_production_gallons: {
        type: BIGINT,
      },
      allocation_gallons: {
        type: BIGINT,
      },
      cum_production_af: {
        type: NUMBER,
      },
      allocation_af: {
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
