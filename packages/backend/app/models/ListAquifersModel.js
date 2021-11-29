module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN} = DataTypes;
  const ListAquifers = sequelize.define(
    'list_aquifers',
    {
      aquifer_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      aquifer_name: {
        type: TEXT,
      },
      aquifer_notes: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      display_order: {
        type: INTEGER,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return ListAquifers;
};
