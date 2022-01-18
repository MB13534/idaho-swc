module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN} = DataTypes;
  const ListTestedBys = sequelize.define(
    'list_tested_bys',
    {
      tested_by_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      tested_by_desc: {
        type: TEXT,
      },
      display_order: {
        type: INTEGER,
      },
      removed: {
        type: BOOLEAN,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return ListTestedBys;
};
