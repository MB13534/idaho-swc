module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID} = DataTypes;
  const CurrentWellsToRolodexContactsTexts = sequelize.define(
    'current_wells_to_rolodex_contacts_texts',
    {
      rolo_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      rolo_text: {
        type: TEXT,
      },
      rolo_text_top_line: {
        type: TEXT,
      },
      id: {
        type: UUID,
      },
      organization: {
        type: TEXT,
      },
      lastname: {
        type: TEXT,
      },
      firstname: {
        type: TEXT,
      },
    },
    {
      schema: 'client_clearwater',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return CurrentWellsToRolodexContactsTexts;
};
