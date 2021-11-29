import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";

export const displayName = (row) => {
  return `${row.well_ndx}`;
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
      field: "well_ndx",
      headerName: "Well Index",
      width: 150,
    },
    {
      field: "cuwcd_well_number",
      headerName: "CUWCD Well Number",
      width: 150,
    },
    {
      field: "state_well_number",
      headerName: "State Well Number",
      width: 150,
    },
    {
      field: "well_name",
      headerName: "Well Name",
      width: 150,
    },
    {
      field: "longitude_dd",
      headerName: "Longitude",
      width: 150,
    },
    {
      field: "latitude_dd",
      headerName: "Latitude",
      width: 150,
    },
    {
      field: "elevation_ftabmsl",
      headerName: "Elevation",
      width: 150,
    },
    {
      field: "well_notes",
      headerName: "Notes",
      width: 150,
    },
    {
      field: "aquifer_ndx",
      headerName: "Aquifer Index",
      width: 150,
    },
    {
      field: "date_drilled",
      headerName: "Date Drilled",
      width: 150,
    },
    {
      field: "drillers_log",
      headerName: "Driller's Log",
      width: 150,
    },
    {
      field: "well_depth_ft",
      headerName: "Well Depth ft",
      width: 150,
    },
    {
      field: "screen_top_depth_ft",
      headerName: "Screen Top Depth ft",
      width: 150,
    },
    {
      field: "screen_bottom_depth_ft",
      headerName: "Screen Bottom Depth ft",
      width: 150,
    },
    {
      field: "construction_notes",
      headerName: "Construction Notes",
      width: 150,
    },
    {
      field: "well_status_ndx",
      headerName: "Well Status Index",
      width: 150,
    },
    {
      field: "exempt",
      headerName: "Exempt",
      width: 150,
    },
    {
      field: "primary_well_use_ndx",
      headerName: "Primary Well Use Index",
      width: 150,
    },
    {
      field: "secondary_well_use_ndx",
      headerName: "Secondary Well Use Index",
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
    name: "Well Index",
    key: "well_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "CUWCD Well Number",
    key: "cuwcd_well_number",
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "State Well Number",
    key: "state_well_number",
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Well Name",
    key: "well_name",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Longitude",
    key: "longitude_dd",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Latitude",
    key: "latitude_dd",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Elevation",
    key: "elevation_ftabmsl",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Notes",
    key: "well_notes",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Aquifer Index",
    key: "aquifer_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Date Drilled",
    key: "date_drilled",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Driller's Log",
    key: "drillers_log",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Well Depth ft",
    key: "well_depth_ft",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Screen Top Depth ft",
    key: "screen_top_depth_ft",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Screen Bottom Depth ft",
    key: "screen_bottom_depth_ft",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Construction Notes",
    key: "construction_notes",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Well Status Index",
    key: "well_status_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Exempt",
    key: "exempt",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Primary Well Use Index",
    key: "primary_well_use_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Secondary Well use Index",
    key: "secondary_well_use_ndx",
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
