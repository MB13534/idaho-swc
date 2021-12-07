module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, GEOMETRY, BOOLEAN, UUID, BIGINT} = DataTypes;
  const UiListWells = sequelize.define(
    'ui_list_wells',
    {
      well_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      state_well_number: {
        type: TEXT,
      },
      longitude_dd: {
        type: NUMBER,
      },
      latitude_dd: {
        type: NUMBER,
      },
      source_aquifer: {
        type: TEXT,
      },
      primary_use: {
        type: TEXT,
      },
      well_owner: {
        type: TEXT,
      },
      well_status: {
        type: TEXT,
      },
      location_geometry: {
        type: GEOMETRY,
      },
      has_production: {
        type: BOOLEAN,
      },
      has_waterlevels: {
        type: BOOLEAN,
      },
      has_wqdata: {
        type: BOOLEAN,
      },
      id: {
        type: UUID,
      },
      is_permitted: {
        type: BOOLEAN,
      },
      is_exempt: {
        type: BOOLEAN,
      },
      is_monitoring: {
        type: BOOLEAN,
      },
      well_type: {
        type: TEXT,
      },
      count_production: {
        type: BIGINT,
      },
      count_waterlevels: {
        type: BIGINT,
      },
      count_wqdata: {
        type: BIGINT,
      },
      well_name: {
        type: TEXT,
      },
      well_depth_ft: {
        type: NUMBER,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return UiListWells;
};
