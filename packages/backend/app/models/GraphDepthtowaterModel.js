module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, DATE} = DataTypes;
  const GraphDepthtowater = sequelize.define(
    'graph_depthtowater',
    {
      well_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      collected_date: {
        type: DATE,
      },
      dtw_ft: {
        type: NUMBER,
      },
      measurement_method_desc: {
        type: TEXT,
      },
      collected_by_desc: {
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

  return GraphDepthtowater;
};
