module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, ARRAY} = DataTypes;
  const TimeseriesDailyDataDropdownParameters = sequelize.define(
    'timeseries_daily_data_dropdown_parameters',
    {
      parameter_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      parameter_name: {
        type: TEXT,
      },
      huc8_ndx_array: {
        type: ARRAY(INTEGER),
      },
    },
    {
      defaultScope: {
        order: [['parameter_name', 'asc']],
      },
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesDailyDataDropdownParameters;
};
