module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL} = DataTypes;
  const TimeseriesDailyData = sequelize.define(
    'timeseries_daily_data',
    {
      rdate: {
        type: DATE,
      },
      loc_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      loc_name: {
        type: TEXT,
      },
      data_provider_ndx: {
        type: INTEGER,
      },
      data_provider_name: {
        type: TEXT,
      },
      loc_type_ndx: {
        type: INTEGER,
      },
      loc_type_name: {
        type: TEXT,
      },
      huc10_ndx: {
        type: INTEGER,
      },
      huc10: {
        type: TEXT,
      },
      huc8_ndx: {
        type: INTEGER,
      },
      huc8: {
        type: TEXT,
      },
      parameter_ndx: {
        type: INTEGER,
      },
      parameter_name: {
        type: TEXT,
      },
      result_value_daily: {
        type: REAL,
      },
      units_ndx: {
        type: INTEGER,
      },
      units_name: {
        type: TEXT,
      },
    },
    {
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesDailyData;
};
