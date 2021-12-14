import React, { useState } from "react";
import styled from "styled-components/macro";
import { DataGrid as MuiDataGrid } from "@material-ui/data-grid";
import { isWidthDown } from "@material-ui/core";
import { ROUTES } from "../../constants";
import { useHistory } from "react-router-dom";

const DataTableWrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  background-color: ${(props) => props.theme.palette.background.paper};

  ${(props) => props.theme.breakpoints.down("xs")} {
    max-height: 400px;
  }
`;

const DataTable = styled(MuiDataGrid)`
  &.MuiDataGrid-root {
    border: none;
    font-size: ${(props) => props.theme.typography.body2.fontSize};
    font-weight: ${(props) => props.theme.typography.fontWeightLight};
    font-family: ${(props) => props.theme.typography.fontFamily};
    color: ${(props) => props.theme.palette.text.secondary} !important;
    .MuiDataGrid-cell
    // {
    //   max-height: 100% !important;
    // }
    ,
    .MuiDataGrid-columnsContainer {
      color: ${(props) => props.theme.palette.text.primary} !important;
      border-bottom: 1px solid
        ${(props) =>
          props.theme.palette.type === "dark"
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)"};
    }
  }
  &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus,
  &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within,
  &.MuiDataGrid-root .MuiDataGrid-cell:focus,
  &.MuiDataGrid-root .MuiDataGrid-cell:focus-within {
    outline: none;
  }

  &.MuiDataGrid-root *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 0px;
    background-color: ${(props) => props.theme.scrollbar.track};
  }

  &.MuiDataGrid-root *::-webkit-scrollbar-corner {
    background-color: ${(props) => props.theme.scrollbar.track};
  }
  &.MuiDataGrid-root *::-webkit-scrollbar-thumb {
    border-radius: 0px;
    border: none;
    background-color: ${(props) => props.theme.scrollbar.thumb};
  }

  .MuiDataGrid-row {
    cursor: pointer;
    // max-height: 100%;
  }
`;

export function ResultsTable({
  configColumns,
  modelName,
  data,
  endpoint,
  width,
}) {
  const history = useHistory();

  const [columns] = useState(configColumns(modelName));
  const [pageSize] = useState(isWidthDown("xs", width) ? 5 : 25);
  const [sortModel, setSortModel] = useState([
    {
      field: "created_at",
      sort: "asc",
    },
  ]);

  const onRowClick = (params) => {
    if (actionsPopupIsOpen()) return;
    history.push(`${ROUTES.MODELS}/${endpoint}/${params.id}`);
  };

  const actionsPopupIsOpen = function () {
    return document.getElementsByClassName("MuiPopover-root").length;
  };

  return (
    <DataTableWrap>
      <div style={{ flexGrow: 1 }}>
        <DataTable
          rows={data}
          columns={columns}
          columnBuffer={columns.length}
          pageSize={pageSize}
          checkboxSelection
          disableSelectionOnClick
          // TODO: dkulak: Either buy MUI XGrid or roll our own (probably the latter)
          // const [selectionModel, setSelectionModel] = React.useState([]);
          // selectionModel={selectionModel}
          // onSelectionModelChange={(newSelectionModel) => {
          //   console.log(newSelectionModel);
          //   setSelectionModel(newSelectionModel);
          // }}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          onRowClick={onRowClick}
        />
      </div>
    </DataTableWrap>
  );
}
