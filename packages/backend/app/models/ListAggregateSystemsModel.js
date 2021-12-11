module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN} = DataTypes;
  const ListAggregateSystems = sequelize.define(
    'list_aggregate_systems',
    {
      agg_system_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      agg_system_name: {
        type: TEXT,
      },
      agg_system_notes: {
        type: TEXT,
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

  return ListAggregateSystems;
};
