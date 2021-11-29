module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN} = DataTypes;
  const ListWaterUses = sequelize.define(
    'list_water_uses',
    {
      use_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      use_desc: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      applies_to: {
        type: TEXT,
      },
      display_order: {
        type: INTEGER,
      },
    },
    {
      schema: 'up_common',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return ListWaterUses;
};
