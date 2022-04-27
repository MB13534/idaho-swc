module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, ARRAY} = DataTypes;
  const TimeseriesDailyDataDropdownLocationsAssocParam = sequelize.define(
    'timeseries_daily_data_dropdown_locations_assoc_param',
    {
      loc_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      loc_name: {
        type: TEXT,
      },
      parameter_ndx_array: {
        type: ARRAY(INTEGER),
      },
      huc8_ndx_array: {
        type: ARRAY(INTEGER),
      },
    },
    {
      defaultScope: {
        order: [['loc_name', 'asc']],
      },
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesDailyDataDropdownLocationsAssocParam;
};
