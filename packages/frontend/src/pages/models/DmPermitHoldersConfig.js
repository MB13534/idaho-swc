import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";

export const displayName = (row) => {
  return `${row.rolo_ndx}`;
};

// export const sortBy = {
//   field: "created_at",
//   sort: "asc",
// };

export function columns(modelName) {
  return [
    {
      field: "",
      headerName: "",
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      disableReorder: true,
      filterable: false,
      resizeable: false,
      align: "center",
      renderCell: (params) => {
        return Renderers.ActionsRenderer(params, modelName);
      },
    },
    // {
    //   field: "content_node_statuses.name",
    //   renderHeader: Renderers.StatusHelpIconRenderer,
    //   width: 20,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   disableReorder: true,
    //   filterable: false,
    //   resizeable: false,
    //   align: "center",
    //   renderCell: Renderers.StatusDotRenderer,
    // },
    // {
    //   field: "rolo_ndx",
    //   headerName: "Rolodex Index",
    //   width: 170,
    // },
    {
      field: "lastname",
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "firstname",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "organization",
      headerName: "Organization",
      width: 170,
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
    },
    {
      field: "zipcode",
      headerName: "Zipcode",
      width: 150,
    },
    {
      field: "email_1",
      headerName: "Email 1",
      width: 150,
    },
    {
      field: "email_2",
      headerName: "Email 2",
      width: 150,
    },
    {
      field: "phone_1",
      headerName: "Phone 1",
      width: 150,
    },
    {
      field: "phone_2",
      headerName: "Phone 2",
      width: 150,
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 150,
    },
    // {
    //   field: "id",
    //   headerName: "ID",
    //   width: 100,
    //   renderCell: Renderers.IdRenderer,
    // },
    // {
    //   field: "created_at",
    //   headerName: "Created At",
    //   width: 250,
    //   renderCell: Renderers.DateRenderer,
    // },
    // {
    //   field: "updated_at",
    //   headerName: "Updated At",
    //   width: 200,
    //   renderCell: Renderers.DateRenderer,
    // },
  ];
}

export const fields = [
  // {
  //   name: "Rolodex Index",
  //   key: "rolo_ndx",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.TEXT,
  //   cols: 12,
  //   isOpen: true,
  // },
  {
    name: "Last Name",
    key: "lastname",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "First Name",
    key: "firstname",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Organization",
    key: "organization",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Address",
    key: "address",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "City",
    key: "city",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "State",
    key: "state",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Zipcode",
    key: "zipcode",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Email 1",
    key: "email_1",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Email 2",
    key: "email_2",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Phone 1",
    key: "phone_1",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Phone 2",
    key: "phone_2",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Notes",
    key: "notes",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
];

const config = {
  displayName,
  columns,
  fields,
};

export default config;
