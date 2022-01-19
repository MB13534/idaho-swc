module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, DATE} = DataTypes;
  const GraphWaterquality = sequelize.define(
    'graph_waterquality',
    {
      well_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      test_datetime: {
        type: DATE,
      },
      wq_parameter_ndx: {
        type: INTEGER,
      },
      wq_parameter_name: {
        type: TEXT,
      },
      result_value: {
        type: NUMBER,
      },
      unit_desc: {
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

  return GraphWaterquality;
};
