import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";

export const displayName = (row) => {
  return `${row.name}`;
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
      field: "id",
      hide: true,
    },
    {
      field: "created_at",
      hide: true,
    },
    {
      field: "updated_at",
      hide: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "well_type.name",
      headerName: "Type",
      width: 150,
      renderCell: Renderers.AssociatedFieldRenderer,
    },
    {
      field: "region.name",
      headerName: "Region",
      width: 150,
      renderCell: Renderers.AssociatedFieldRenderer,
    },
    {
      field: "last_measured",
      headerName: "Last Measured",
      width: 250,
      renderCell: Renderers.DateRenderer,
    },
  ];
}

export const fields = [
  {
    name: "Name",
    key: "name",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 6,
    isOpen: true,
  },
  {
    name: "Type",
    key: "well_type_id",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: { table: "well_types" },
    cols: 6,
    isOpen: true,
  },
  {
    name: "Groundwater Elevation",
    key: "gw_elev",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    cols: 4,
    isOpen: true,
  },
  {
    name: "FT (AMSL)",
    key: "ft_amsl",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    cols: 4,
    isOpen: true,
  },
  {
    name: "NO2 Concentration",
    key: "no2_conc",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    cols: 4,
    isOpen: true,
  },
  {
    name: "Region",
    key: "region_id",
    required: false,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: { table: "regions" },
    cols: 6,
    isOpen: true,
  },
  {
    name: "Last Measured",
    key: "last_measured",
    required: false,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 6,
    isOpen: true,
  },
];

const config = {
  displayName,
  columns,
  fields,
};

export default config;
