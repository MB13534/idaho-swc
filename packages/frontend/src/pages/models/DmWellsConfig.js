import React from "react";
import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";
import LatLongMap from "../../components/map/LatLongMap";
import { Grid } from "@material-ui/core";

export const displayName = (row) => {
  return `${row.cuwcd_well_number}`;
};

export const crudModelNameLabels = {
  standard: "Wells",
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
    {
      field: "cuwcd_well_number",
      headerName: "CUWCD Well Number",
      width: 225,
    },
    {
      field: "exempt",
      headerName: "Exempt?",
      width: 135,
      renderCell: Renderers.FormatBooleanTrueFalse,
    },
    {
      field: "state_well_number",
      headerName: "State Well Number",
      width: 205,
    },
    {
      field: "well_name",
      headerName: "Well Name",
      width: 150,
    },
    {
      field: "primary_well_use_ndx",
      headerName: "Primary Well Use",
      width: 210,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_water_uses",
      lookupKey: "use_ndx",
      lookupValue: "use_desc",
    },
    {
      field: "secondary_well_use_ndx",
      headerName: "Secondary Well Use",
      width: 210,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_water_uses",
      lookupKey: "use_ndx",
      lookupValue: "use_desc",
    },
    {
      field: "latitude_dd",
      headerName: "Latitude",
      width: 150,
    },
    {
      field: "longitude_dd",
      headerName: "Longitude",
      width: 150,
    },
    {
      field: "well_status_ndx",
      headerName: "Well Status",
      width: 150,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_well_statuses",
      lookupKey: "well_status_ndx",
      lookupValue: "well_status_desc",
    },
    {
      field: "aquifer_ndx",
      headerName: "Aquifer",
      width: 150,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "list_aquifers",
      lookupKey: "aquifer_ndx",
      lookupValue: "aquifer_name",
    },
    {
      field: "elevation_ftabmsl",
      headerName: "Elevation (ft)",
      width: 175,
    },
    {
      field: "well_notes",
      headerName: "Well Notes",
      width: 300,
    },
    {
      field: "driller",
      headerName: "Driller",
      width: 150,
    },
    {
      field: "date_drilled",
      headerName: "Date Drilled",
      width: 160,
    },
    {
      field: "drillers_log",
      headerName: "Driller's Log?",
      width: 165,
      renderCell: Renderers.FormatBooleanTrueFalse,
    },
    {
      field: "well_depth_ft",
      headerName: "Well Depth (ft)",
      width: 175,
    },
    {
      field: "screen_top_depth_ft",
      headerName: "Top of Screen (ft)",
      width: 215,
    },
    {
      field: "screen_bottom_depth_ft",
      headerName: "Bottom of Screen (ft)",
      width: 215,
    },
    {
      field: "construction_notes",
      headerName: "Construction Notes",
      width: 220,
    },
    {
      field: "owner_rolo_ndx",
      headerName: "Well Owner",
      width: 400,
      renderCell: (params) =>
        Renderers.FormatIndexFromSplitString(
          Renderers.DropdownValueRenderer(params),
          0,
          "; "
        ),
      lookupModel: "current_wells_to_rolodex_owners_texts",
      lookupKey: "rolo_ndx",
      lookupValue: "rolo_text",
    },
    {
      field: "contact_rolo_ndx",
      headerName: "Well Contact",
      width: 400,
      renderCell: (params) =>
        Renderers.FormatIndexFromSplitString(
          Renderers.DropdownValueRenderer(params),
          0,
          "; "
        ),
      lookupModel: "current_wells_to_rolodex_contacts_texts",
      lookupKey: "rolo_ndx",
      lookupValue: "rolo_text",
    },
    {
      field: "list_of_attachments",
      headerName: "Attachments",
      renderCell: Renderers.FormatBooleanTrueFalse,
      width: 170,
    },
    {
      field: "editor_name",
      headerName: "Updated By",
      width: 170,
    },
    {
      field: "registration_date ",
      headerName: "Original Registration Date",
      width: 270,
    },
    {
      field: "registration_notes ",
      headerName: "Original Registration Notes",
      width: 270,
    },
    // {
    //   field: "well_ndx",
    //   headerName: "Well Index",
    //   width: 125,
    // },
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
  {
    type: CRUD_FIELD_TYPES.SECTION_HEADER,
    title: "Basic Well Information",
  },
  {
    name: "CUWCD Well Number",
    key: "cuwcd_well_number",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 4,
    isOpen: true,
  },
  {
    name: "Well Status",
    key: "well_status_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_well_statuses",
      key: "well_status_ndx",
      value: "well_status_desc",
      crud: false,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Exempt?",
    key: "exempt",
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
  },
  {
    name: "Well Name",
    key: "well_name",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 8,
    isOpen: true,
  },
  {
    name: "State Well Number",
    key: "state_well_number",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 4,
    isOpen: true,
  },
  {
    name: "Well Notes",
    key: "well_notes",
    required: false,
    type: CRUD_FIELD_TYPES.MULTILINE_TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    type: CRUD_FIELD_TYPES.SECTION_HEADER,
    title: "Location",
  },
  {
    name: "Latitude",
    key: "latitude_dd",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 15,
      min: -90,
      max: 90,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Longitude",
    key: "longitude_dd",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 15,
      min: -180,
      max: 180,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Elevation (ft)",
    key: "elevation_ftabmsl",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 5,
      moreThan: 0,
    },
    cols: 4,
    isOpen: true,
  },
  {
    type: CRUD_FIELD_TYPES.CUSTOM,
    component: (config) => (
      <Grid item xs={12} style={{ paddingTop: "0" }}>
        <LatLongMap config={config} />
      </Grid>
    ),
  },
  {
    type: CRUD_FIELD_TYPES.SECTION_HEADER,
    title: "Use and Status",
  },
  {
    name: "Primary Well Use",
    key: "primary_well_use_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_water_uses",
      key: "use_ndx",
      value: "use_desc",
      crud: false,
    },
    cols: 6,
    isOpen: true,
  },
  {
    name: "Secondary Well Use",
    key: "secondary_well_use_ndx",
    required: false,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_water_uses",
      key: "use_ndx",
      value: "use_desc",
      crud: false,
    },
    cols: 6,
    isOpen: true,
  },
  {
    type: CRUD_FIELD_TYPES.SECTION_HEADER,
    title: "Construction Information",
  },
  {
    name: "Date Drilled",
    key: "date_drilled",
    required: false,
    type: CRUD_FIELD_TYPES.DATE,
    cols: 4,
    isOpen: true,
  },
  {
    name: "Aquifer",
    key: "aquifer_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "list_aquifers",
      key: "aquifer_ndx",
      value: "aquifer_name",
      crud: false,
    },
    cols: 8,
    isOpen: true,
  },
  {
    name: "Well Depth (ft)",
    key: "well_depth_ft",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 2,
      moreThan: 0,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Top of Screen (ft)",
    key: "screen_top_depth_ft",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 2,
      moreThan: 0,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Bottom of Screen (ft)",
    key: "screen_bottom_depth_ft",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 2,
      moreThan: 0,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Driller",
    key: "driller",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 8,
    isOpen: true,
  },
  {
    name: "Driller's Log?",
    key: "drillers_log",
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
  },
  {
    name: "Construction Notes",
    key: "construction_notes",
    required: false,
    type: CRUD_FIELD_TYPES.MULTILINE_TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    type: CRUD_FIELD_TYPES.SECTION_HEADER,
    title: "Owner and Contact Information",
  },
  {
    name: "Well Owner",
    key: "owner_rolo_ndx",
    required: false,
    type: CRUD_FIELD_TYPES.SPLIT_STRING_DROPDOWN,
    typeConfig: {
      table: "current_wells_to_rolodex_owners_texts",
      key: "rolo_ndx",
      value: "rolo_text",
      crud: false,
    },
    cols: 12,
    isOpen: true,
  },
  {
    name: "Well Contact",
    key: "contact_rolo_ndx",
    required: false,
    type: CRUD_FIELD_TYPES.SPLIT_STRING_DROPDOWN,
    typeConfig: {
      table: "current_wells_to_rolodex_contacts_texts",
      key: "rolo_ndx",
      value: "rolo_text",
      crud: false,
    },
    cols: 12,
    isOpen: true,
  },
  {
    name: "Attachments",
    key: "list_of_attachments",
    required: false,
    type: CRUD_FIELD_TYPES.READ_ONLY_ARRAY_OF_LINKS,
    cols: 12,
    isOpen: true,
  },
  // {
  //   name: "Well Index",
  //   key: "well_ndx",
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
