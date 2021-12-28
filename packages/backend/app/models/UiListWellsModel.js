module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, NUMBER, GEOMETRY, BOOLEAN, UUID, BIGINT, DATE, ARRAY} =
    DataTypes;
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
      exempt: {
        type: TEXT,
      },
      well_name: {
        type: TEXT,
      },
      state_well_number: {
        type: TEXT,
      },
      well_status: {
        type: TEXT,
      },
      source_aquifer: {
        type: TEXT,
      },
      well_depth_ft: {
        type: NUMBER,
      },
      elevation_ftabmsl: {
        type: NUMBER,
      },
      screen_top_depth_ft: {
        type: NUMBER,
      },
      screen_bottom_depth_ft: {
        type: NUMBER,
      },
      primary_use: {
        type: TEXT,
      },
      secondary_use: {
        type: TEXT,
      },
      agg_system_name: {
        type: TEXT,
      },
      permit_number: {
        type: TEXT,
      },
      well_owner: {
        type: TEXT,
      },
      well_owner_address: {
        type: TEXT,
      },
      well_owner_phone: {
        type: TEXT,
      },
      well_owner_email: {
        type: TEXT,
      },
      well_contact: {
        type: TEXT,
      },
      well_contact_address: {
        type: TEXT,
      },
      well_contact_phone: {
        type: TEXT,
      },
      well_contact_email: {
        type: TEXT,
      },
      driller: {
        type: TEXT,
      },
      date_drilled: {
        type: DATE,
      },
      drillers_log: {
        type: BOOLEAN,
      },
      general_notes: {
        type: TEXT,
      },
      well_remarks: {
        type: TEXT,
      },
      has_production: {
        type: BOOLEAN,
      },
      count_production: {
        type: BIGINT,
      },
      has_waterlevels: {
        type: BOOLEAN,
      },
      count_waterlevels: {
        type: BIGINT,
      },
      has_wqdata: {
        type: BOOLEAN,
      },
      count_wqdata: {
        type: BIGINT,
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
      longitude_dd: {
        type: NUMBER,
      },
      latitude_dd: {
        type: NUMBER,
      },
      id: {
        type: UUID,
      },
      registration_notes: {
        type: TEXT,
      },
      registration_date: {
        type: DATE,
      },
      editor_name: {
        type: TEXT,
      },
      last_edited_date: {
        type: DATE,
      },
      list_of_attachments: {
        type: TEXT,
      },
      location_geometry: {
        type: GEOMETRY,
      },
      authorized_users: {
        type: ARRAY(TEXT),
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
