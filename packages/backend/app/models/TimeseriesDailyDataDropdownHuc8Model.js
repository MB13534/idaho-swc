module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
  const TimeseriesDailyDataDropdownHuc8 = sequelize.define(
    'timeseries_daily_data_dropdown_huc8',
    {
      huc8_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      huc8: {
        type: TEXT,
      },
    },
    {
      defaultScope: {
        order: [['huc8', 'asc']],
      },
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesDailyDataDropdownHuc8;
};
