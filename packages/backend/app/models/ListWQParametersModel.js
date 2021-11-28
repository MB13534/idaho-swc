module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
  const ListWQParameters = sequelize.define(
    'list_wq_parameters',
    {
      wq_parameter_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      wq_parameter_name: {
        type: TEXT,
      },
      unit_ndx: {
        type: INTEGER,
      },
      notes: {
        type: TEXT,
      },
      display_order: {
        type: INTEGER,
      },
      characteristic: {
        type: TEXT,
      },
      fraction: {
        type: TEXT,
      },
      speciation: {
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

  return ListWQParameters;
};
