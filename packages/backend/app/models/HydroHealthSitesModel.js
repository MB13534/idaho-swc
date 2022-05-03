module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, GEOMETRY, BIGINT, DATE, DOUBLE, REAL} = DataTypes;
  const HydroHealthSites = sequelize.define(
    'hydro_health_sites',
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
      por_start: {
        type: DATE,
      },
      por_end: {
        type: DATE,
      },
      num_days: {
        type: INTEGER,
      },
      num_years: {
        type: REAL,
      },
      total_samples: {
        type: BIGINT,
      },
      lat_dd: {
        type: DOUBLE,
      },
      lon_dd: {
        type: DOUBLE,
      },
      loc_region: {
        type: TEXT,
      },
      huc10_name: {
        type: TEXT,
      },
      huc8_name: {
        type: TEXT,
      },
      irgg_type: {
        type: TEXT,
      },
      location_geometry: {
        type: GEOMETRY,
      },
      loc_url: {
        type: TEXT,
      },
      avg_start_water_year: {
        type: INTEGER,
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

  return HydroHealthSites;
};
