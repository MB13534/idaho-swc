module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, GEOMETRY, ARRAY, DOUBLE} = DataTypes;
  const SummaryOfSitesTscompare = sequelize.define(
    'summary_of_sites_tscompare',
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
      parameter_ndx_array: {
        type: ARRAY(INTEGER),
      },
      parameter_name_array: {
        type: ARRAY(TEXT),
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
    },
    {
      schema: 'viewer',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return SummaryOfSitesTscompare;
};
