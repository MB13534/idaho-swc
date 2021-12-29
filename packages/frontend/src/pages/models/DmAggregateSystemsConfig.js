import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";

export const displayName = (row) => {
  return `${row.agg_system_name}`;
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
    //   field: "agg_system_ndx",
    //   headerName: "Aggregated System Index",
    //   width: 250,
    // },
    {
      field: "agg_system_name",
      headerName: "Aggregated System Name",
      width: 260,
    },
    {
      field: "agg_system_notes",
      headerName: "Notes",
      width: 120,
    },
    {
      field: "inactive",
      headerName: "Inactive?",
      renderCell: Renderers.FormatBooleanTrueFalse,
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
  //   name: "Aggregated System Index",
  //   key: "agg_system_ndx",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.TEXT,
  //   cols: 12,
  //   isOpen: true,
  // },
  {
    name: "Aggregated System Name",
    key: "agg_system_name",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Notes",
    key: "agg_system_notes",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Inactive?",
    key: "inactive",
    required: false,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_booleans",
      key: "boolean_value",
      value: "boolean_label",
      crud: false,
    },
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
