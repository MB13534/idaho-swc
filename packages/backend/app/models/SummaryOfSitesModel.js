module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, GEOMETRY, BIGINT, DATE, DOUBLE, REAL} = DataTypes;
  const SummaryOfSites = sequelize.define(
    'summary_of_sites',
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
    },
    {
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return SummaryOfSites;
};
