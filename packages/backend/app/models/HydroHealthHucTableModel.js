module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL} = DataTypes;
  const HydroHealthHucTable = sequelize.define(
    'hydro_health_huc_table',
    {
      huc8_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      huc8_name: {
        type: TEXT,
      },
      water_year: {
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

  return HydroHealthHucTable;
};
