module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, GEOMETRY, BIGINT, DATE, DOUBLE, REAL} = DataTypes;
  const SummaryOfSitesTable = sequelize.define(
    'summary_of_sites_table',
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
      irgg_type: {
        type: TEXT,
      },
      location_geometry: {
        type: GEOMETRY,
      },
    },
    {
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return SummaryOfSitesTable;
};
