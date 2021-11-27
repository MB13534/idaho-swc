import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";

export const displayName = (row) => {
  return `${row.cuwcd_well_number}`;
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
      field: "halff_last_edited_by",
      headerName: "Last Edited By",
      width: 150,
    },
    {
      field: "halff_last_edited_date",
      headerName: "Last Edit Date",
      width: 150,
    },
    {
      field: "well_notes",
      headerName: "Notes",
      width: 150,
    },
    {
      field: "removed",
      headerName: "",
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
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Last Edited By",
    key: "halff_last_edited_by",
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Last Edit Date",
    key: "halff_last_edited_date",
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Notes",
    key: "well_notes",
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Removed",
    key: "removed",
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
