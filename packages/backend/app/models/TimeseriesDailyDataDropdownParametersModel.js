module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
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
