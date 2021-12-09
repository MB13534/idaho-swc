module.exports = (sequelize, DataTypes) => {
  const {TEXT, BOOLEAN} = DataTypes;
  const ListBooleans = sequelize.define(
    'list_booleans',
    {
      boolean_value: {
        type: BOOLEAN,
        primaryKey: true,
      },
      boolean_label: {
        type: TEXT,
      },
    },
    {
      schema: 'up_common',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return ListBooleans;
};
