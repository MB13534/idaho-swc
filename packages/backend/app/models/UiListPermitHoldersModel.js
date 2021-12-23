module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID} = DataTypes;
  const UiListPermitHolders = sequelize.define(
    'ui_list_permit_holders',
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

  return UiListPermitHolders;
};
