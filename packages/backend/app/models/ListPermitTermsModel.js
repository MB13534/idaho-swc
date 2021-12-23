module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, BOOLEAN} = DataTypes;
  const ListPermitTerms = sequelize.define(
    'list_permit_terms',
    {
      permit_terms_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      permit_terms: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      permit_terms_label: {
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

  return ListPermitTerms;
};
