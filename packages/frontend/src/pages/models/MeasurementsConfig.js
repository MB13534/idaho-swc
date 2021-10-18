import { Renderers } from "../../components/crud/ResultsRenderers";
import { CRUD_FIELD_TYPES } from "../../constants";

export const displayName = (row) => {
  return `${row.reading_date}`;
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
      field: "well.name",
      headerName: "Well",
      width: 150,
      renderCell: Renderers.AssociatedFieldRenderer,
    },
    {
      field: "reading_date",
      headerName: "Reading Date",
      width: 200,
    },
    {
      field: "reading1",
      headerName: "Read 1",
      width: 120,
    },
    {
      field: "reading2",
      headerName: "Read 2",
      width: 120,
    },
    {
      field: "reading3",
      headerName: "Read 3",
      width: 120,
    },
  ];
}

export const fields = [
  {
    name: "Well",
    key: "well_id",
    required: false,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: { table: "wells" },
    cols: 6,
    isOpen: true,
  },
  {
    name: "Reading Date",
    key: "reading_date",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 6,
    isOpen: true,
  },
  {
    name: "Reading 1",
    key: "reading1",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    cols: 4,
    isOpen: true,
  },
  {
    name: "Reading 2",
    key: "reading2",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    cols: 4,
    isOpen: true,
  },
  {
    name: "Reading 3",
    key: "reading3",
    required: false,
    type: CRUD_FIELD_TYPES.NUMBER,
    cols: 4,
    isOpen: true,
  },
];

const config = {
  displayName,
  columns,
  fields,
};

export default config;
