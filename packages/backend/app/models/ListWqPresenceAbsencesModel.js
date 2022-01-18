module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
  const ListWqPresenceAbsences = sequelize.define(
    'list_wq_presence_absences',
    {
      pa_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      pa_desc: {
        type: TEXT,
      },
      sort: {
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

  return ListWqPresenceAbsences;
};
