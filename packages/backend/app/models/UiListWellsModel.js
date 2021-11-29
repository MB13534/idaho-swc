module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, GEOMETRY, BOOLEAN, UUID} = DataTypes;
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
