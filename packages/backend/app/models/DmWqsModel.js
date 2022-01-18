module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL, BIGINT, DATE, BOOLEAN} = DataTypes;
  const DmWqs = sequelize.define(
    'dm_wqs',
    {
      well_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      cuwcd_well_number: {
        type: TEXT,
      },
      collected_by_ndx: {
        type: INTEGER,
      },
      tested_by_ndx: {
        type: INTEGER,
      },
      ecoli_presence: {
        type: INTEGER,
      },
      coliform_presence: {
        type: INTEGER,
      },
      ph: {
        type: REAL,
      },
      conductivity: {
        type: REAL,
      },
      tds: {
        type: REAL,
      },
      salinity: {
        type: REAL,
      },
      alkalinity: {
        type: REAL,
      },
      hardness: {
        type: REAL,
      },
      nitrite: {
        type: REAL,
      },
      nitrate: {
        type: REAL,
      },
      phosphate: {
        type: REAL,
      },
      sulfate: {
        type: REAL,
      },
      fluoride: {
        type: REAL,
      },
      wq_sample_notes: {
        type: TEXT,
      },
      ndx: {
        type: BIGINT,
      },
      placeholder: {
        type: BOOLEAN,
      },
      created_timestamp: {
        type: DATE,
      },
      created_by: {
        type: TEXT,
      },
      modified_by: {
        type: TEXT,
      },
      test_datetime: {
        type: DATE,
      },
    },
    {
      defaultScope: {
        order: [['test_datetime', 'desc']],
      },
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return DmWqs;
};
