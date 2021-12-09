import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";

export const displayName = (row) => {
  return `${row.permit_ndx}`;
};

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
    {
      field: "content_node_statuses.name",
      renderHeader: Renderers.StatusHelpIconRenderer,
      width: 20,
      sortable: false,
      disableColumnMenu: true,
      disableReorder: true,
      filterable: false,
      resizeable: false,
      align: "center",
      renderCell: Renderers.StatusDotRenderer,
    },
    {
      field: "permit_ndx",
      headerName: "Permit Index",
      width: 150,
    },
    {
      field: "permit_type_ndx",
      headerName: "Permit Type Index",
      width: 150,
    },
    {
      field: "permit_prefix",
      headerName: "Permit Prefix",
      width: 150,
    },
    {
      field: "permit_id",
      headerName: "Permit Id",
      width: 150,
    },
    {
      field: "permit_number",
      headerName: "Permit Number",
      width: 150,
    },
    {
      field: "permit_year",
      headerName: "Permit Year",
      width: 150,
    },
    {
      field: "agg_system_ndx",
      headerName: "Agg System Index",
      width: 150,
    },
    {
      field: "permitted_value",
      headerName: "Permitted Value",
      width: 150,
    },
    {
      field: "use_ndx",
      headerName: "Use Index",
      width: 150,
    },
    {
      field: "expiration_date",
      headerName: "Expiration Date",
      width: 150,
    },
    {
      field: "permit_terms_ndx",
      headerName: "Permit Terms Index",
      width: 150,
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 150,
    },
    {
      field: "exportable",
      headerName: "Exportable?",
      width: 150,
      renderCell: Renderers.FormatBooleanTrueFalse,
    },
    {
      field: "exportable_amount",
      headerName: "Exportable Amount",
      width: 150,
    },
    {
      field: "permit_data_ndx",
      headerName: "Permit Data Index",
      width: 150,
    },
    {
      field: "assoc_wells",
      headerName: "Assoc Wells",
      width: 150,
    },
    {
      field: "assoc_well_ndx",
      headerName: "Assoc Well Index",
      width: 150,
    },
    {
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: Renderers.IdRenderer,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 250,
      renderCell: Renderers.DateRenderer,
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 200,
      renderCell: Renderers.DateRenderer,
    },
  ];
}

export const fields = [
  {
    name: "Permit Index",
    key: "permit_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Type Index",
    key: "permit_type_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Prefix",
    key: "permit_prefix",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Id",
    key: "permit_id",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Number",
    key: "permit_number",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Year",
    key: "permit_year",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Agg System Index",
    key: "agg_system_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permitted Value",
    key: "permitted_value",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Use Index",
    key: "use_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Expiration Date",
    key: "expiration_date",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Terms Index",
    key: "permit_terms_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Notes",
    key: "notes",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Exportable?",
    key: "exportable",
    required: true,
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
  {
    name: "Exportable Amount",
    key: "exportable_amount",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Data Index",
    key: "permit_data_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Assoc Wells",
    key: "assoc_wells",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Assoc Well Index",
    key: "assoc_well_ndx",
    required: true,
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
