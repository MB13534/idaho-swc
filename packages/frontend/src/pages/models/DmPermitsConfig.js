import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";
import { add } from "date-fns";

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
    {
      field: "permit_id",
      headerName: "Permit Id",
      width: 150,
    },
    {
      field: "permit_year",
      headerName: "Permit Year",
      width: 160,
    },
    {
      field: "permit_type_ndx",
      headerName: "Permit Type",
      width: 175,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_permit_types",
      lookupKey: "permit_type_ndx",
      lookupValue: "permit_type_desc",
    },
    {
      field: "permit_number",
      headerName: "Permit Number",
      width: 190,
    },
    {
      field: "agg_system_ndx",
      headerName: "Aggregated System",
      width: 220,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_aggregate_systems",
      lookupKey: "agg_system_ndx",
      lookupValue: "agg_system_name",
    },
    {
      field: "permitted_value",
      headerName: "Permitted Value",
      width: 220,
    },
    {
      field: "use_ndx",
      headerName: "Permitted Use",
      width: 200,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_water_uses",
      lookupKey: "use_ndx",
      lookupValue: "use_desc",
    },
    {
      field: "expiration_date",
      headerName: "Expiration Date",
      width: 200,
    },
    {
      field: "exportable",
      headerName: "Exportable?",
      width: 170,
      renderCell: Renderers.FormatBooleanTrueFalse,
    },
    {
      field: "exportable_amount",
      headerName: "Exportable Amount",
      width: 220,
    },
    {
      field: "rolo_ndx",
      headerName: "Permit Holder",
      width: 200,
      renderCell: (params) =>
        Renderers.FormatIndexFromSplitString(
          Renderers.DropdownValueRenderer(params),
          0,
          "; "
        ),
      lookupModel: "ui_list_permit_holders",
      lookupKey: "rolo_ndx",
      lookupValue: "rolo_text",
    },
    {
      field: "assoc_wells",
      headerName: "Associated Wells",
      width: 220,
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 150,
    },
    {
      field: "permit_terms_ndx",
      headerName: "Permit Terms",
      width: 200,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_permit_terms",
      lookupKey: "permit_terms_ndx",
      lookupValue: "permit_terms",
    },
    // {
    //   field: "permit_ndx",
    //   headerName: "Permit Index",
    //   width: 150,
    // },
    // {
    //   field: "permit_prefix",
    //   headerName: "Permit Prefix",
    //   width: 150,
    // },
    // {
    //   field: "permit_data_ndx",
    //   headerName: "Permit Data Index",
    //   width: 150,
    // },
    // {
    //   field: "assoc_well_ndx",
    //   headerName: "Assoc Well Index",
    //   width: 150,
    // },
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
    name: "Permit Id",
    key: "permit_id",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 4,
    isOpen: true,
    typeConfig: {
      disabled: true,
    },
  },
  {
    name: "Permit Year",
    key: "permit_year",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    cols: 4,
    isOpen: true,
    defaultValue: add(new Date(), { weeks: 1 }).getFullYear(),
    typeConfig: {
      min: 1900,
      max: new Date().getFullYear() + 1,
      allowNegative: false,
    },
  },
  {
    name: "Permit Type",
    key: "permit_type_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_permit_types",
      key: "permit_type_ndx",
      value: "permit_type_desc",
      crud: true,
    },
    cols: 4,
    isOpen: true,
    defaultValue: 2,
  },
  {
    name: "Permit Number",
    key: "permit_number",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 4,
    isOpen: true,
    typeConfig: {
      disabled: true,
    },
  },
  {
    name: "Aggregated System",
    key: "agg_system_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_aggregate_systems",
      key: "agg_system_ndx",
      value: "agg_system_name",
      crud: false,
    },
    cols: 8,
    isOpen: true,
    defaultValue: 70,
  },
  {
    name: "Permitted Value",
    key: "permitted_value",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      min: 0,
      suffix: " (af)",
      allowNegative: false,
      decimalScale: 3,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Permitted Use",
    key: "use_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_water_uses",
      key: "use_ndx",
      value: "use_desc",
      crud: false,
    },
    cols: 8,
    isOpen: true,
    defaultValue: 4,
  },
  {
    name: "Expiration Date",
    key: "expiration_date",
    required: false,
    type: CRUD_FIELD_TYPES.DATE,
    cols: 4,
    isOpen: true,
    defaultValue: new Date(add(new Date(), { weeks: 1 }).getFullYear(), 11, 31),
  },
  {
    name: "Exportable?",
    key: "exportable",
    required: false,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_booleans",
      key: "boolean_value",
      value: "boolean_label",
      crud: false,
    },
    cols: 4,
    isOpen: true,
    defaultValue: false,
  },
  {
    name: "Exportable Amount",
    key: "exportable_amount",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      min: 0,
      suffix: " (af)",
      allowNegative: false,
    },
    cols: 4,
    isOpen: true,
    defaultValue: 0,
  },
  {
    name: "Permit Holder",
    key: "rolo_ndx",
    required: false,
    type: CRUD_FIELD_TYPES.SPLIT_STRING_DROPDOWN,
    typeConfig: {
      table: "ui_list_permit_holders",
      key: "rolo_ndx",
      value: "rolo_text",
      crud: false,
    },
    cols: 6,
    isOpen: true,
  },
  {
    name: "Assoc Wells",
    key: "assoc_wells",
    required: false,
    type: CRUD_FIELD_TYPES.READ_ONLY_ARRAY_OF_STRINGS,
    cols: 6,
    isOpen: true,
    typeConfig: {
      disabled: true,
    },
  },
  {
    name: "Notes",
    key: "notes",
    required: false,
    type: CRUD_FIELD_TYPES.MULTILINE_TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Permit Terms Index",
    key: "permit_terms_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_permit_terms",
      key: "permit_terms_ndx",
      value: "permit_terms",
      crud: false,
    },
    cols: 12,
    isOpen: true,
    defaultValue: 1,
  },

  // {
  //   name: "Permit Index",
  //   key: "permit_ndx",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.TEXT,
  //   cols: 12,
  //   isOpen: true,
  // },
  // {
  //   name: "Permit Prefix",
  //   key: "permit_prefix",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.TEXT,
  //   cols: 12,
  //   isOpen: true,
  // },
  // {
  //   name: "Permit Data Index",
  //   key: "permit_data_ndx",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.TEXT,
  //   cols: 12,
  //   isOpen: true,
  // },
  // {
  //   name: "Assoc Well Index",
  //   key: "assoc_well_ndx",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.TEXT,
  //   cols: 12,
  //   isOpen: true,
  // },
];

const config = {
  displayName,
  columns,
  fields,
};

export default config;
