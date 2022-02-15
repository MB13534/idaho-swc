module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, BOOLEAN, ARRAY} = DataTypes;
  const ListRolodexes = sequelize.define(
    'list_rolodexes',
    {
      rolo_ndx: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lastname: {
        type: TEXT,
      },
      firstname: {
        type: TEXT,
      },
      organization: {
        type: TEXT,
      },
      address: {
        type: TEXT,
      },
      city: {
        type: TEXT,
      },
      state: {
        type: TEXT,
      },
      zipcode: {
        type: TEXT,
      },
      email_1: {
        type: TEXT,
      },
      email_2: {
        type: TEXT,
      },
      phone_1: {
        type: TEXT,
      },
      phone_2: {
        type: TEXT,
      },
      removed: {
        type: BOOLEAN,
      },
      notes: {
        type: TEXT,
      },
      createdby: {
        type: TEXT,
      },
      createddate: {
        type: DATE,
      },
      modifiedby: {
        type: TEXT,
      },
      modifiedtimestamp: {
        type: DATE,
      },
      orig_owner_ndx_akas: {
        type: ARRAY(INTEGER),
      },
      permit_holder: {
        type: BOOLEAN,
      },
      well_contact: {
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

  return ListRolodexes;
};
