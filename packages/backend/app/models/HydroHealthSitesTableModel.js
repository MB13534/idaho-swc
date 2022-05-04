module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL} = DataTypes;
  const HydroHealthSitesTable = sequelize.define(
    'hydro_health_sites_table',
    {
      loc_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      loc_type_ndx: {
        type: INTEGER,
      },
      loc_type_name: {
        type: TEXT,
      },
      parameter_ndx: {
        type: INTEGER,
      },
      parameter_name: {
        type: TEXT,
      },
      data_provider: {
        type: TEXT,
      },
      loc_id: {
        type: TEXT,
      },
      loc_name: {
        type: TEXT,
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

  return HydroHealthSitesTable;
};
