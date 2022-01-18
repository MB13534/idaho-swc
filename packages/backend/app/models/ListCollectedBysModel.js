module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN, ARRAY} = DataTypes;
  const ListCollectedBys = sequelize.define(
    'list_collected_bys',
    {
      collected_by_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      collected_by_desc: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      display_order: {
        type: INTEGER,
      },
      applies_to: {
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

  return ListCollectedBys;
};
