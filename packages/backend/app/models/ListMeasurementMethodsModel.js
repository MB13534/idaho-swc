module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN, ARRAY} = DataTypes;
  const ListMeasurementMethods = sequelize.define(
    'list_measurement_methods',
    {
      measurement_method_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      measurement_method_desc: {
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

  return ListMeasurementMethods;
};
