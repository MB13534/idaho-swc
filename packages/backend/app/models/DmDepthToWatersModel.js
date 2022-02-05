module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL, DATE, BIGINT, BOOLEAN} = DataTypes;
  const DmDepthToWaters = sequelize.define(
    'dm_depth_to_waters',
    {
      well_ndx: {
        type: INTEGER,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      collected_datetime: {
        type: DATE,
      },
      measurement_method_ndx: {
        type: INTEGER,
      },
      collected_by_ndx: {
        type: INTEGER,
      },
      pumping_status_ndx: {
        type: INTEGER,
      },
      meas_1: {
        type: REAL,
      },
      meas_2: {
        type: REAL,
      },
      meas_3: {
        type: REAL,
      },
      meas_4: {
        type: REAL,
      },
      dtw_notes: {
        type: TEXT,
      },
      static_water_level_ft: {
        type: REAL,
      },
      qtr_mile_wells_exist: {
        type: BOOLEAN,
      },
      placeholder: {
        type: BOOLEAN,
      },
      modified_by: {
        type: TEXT,
      },
      created_by: {
        type: TEXT,
      },
      created_timestamp: {
        type: DATE,
      },
      final_dtw_ft: {
        type: REAL,
      },
      ndx: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      // defaultScope: {
      //   order: [
      //     ['report_year', 'desc'],
      //     ['report_month', 'desc'],
      //   ],
      // },
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return DmDepthToWaters;
};
