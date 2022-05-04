module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL} = DataTypes;
  const HydroHealthHucMap = sequelize.define(
    'hydro_health_huc_map',
    {
      huc8_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      huc8_name: {
        type: TEXT,
      },
      yrs_inc_in_avg: {
        type: INTEGER,
      },
      indicator: {
        type: REAL,
      },
      median_indicator: {
        type: REAL,
      },
      hydro_health_pct: {
        type: REAL,
      },
    },
    {
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return HydroHealthHucMap;
};
