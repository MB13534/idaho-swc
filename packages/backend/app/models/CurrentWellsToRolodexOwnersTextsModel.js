module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID} = DataTypes;
  const CurrentWellsToRolodexOwnersTexts = sequelize.define(
    'current_wells_to_rolodex_owners_texts',
    {
      rolo_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      rolo_text: {
        type: TEXT,
      },
      id: {
        type: UUID,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return CurrentWellsToRolodexOwnersTexts;
};
