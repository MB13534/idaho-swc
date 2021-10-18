import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import { CRUD_DISPLAY_MODES } from "../../constants";
import {
  ViewHeadline as TableModeIcon,
  ViewModule as CardModeIcon,
  ViewStream as ListModeIcon,
} from "@material-ui/icons";
import React from "react";
import styled from "styled-components/macro";
import Button from "@material-ui/core/Button";
import { darken, Grid, lighten } from "@material-ui/core";

const ToggleWrap = styled(Grid)`
  text-align: right;
  margin-right: 16px;

  ${(props) => props.theme.breakpoints.down("xs")} {
    text-align: left;
  }
`;

const ToggleButton = styled(Button)`
  width: 40px;
  min-width: 40px;
  background-color: ${(props) => props.theme.palette.background.toolbar};

  &.active {
    background-color: ${(props) =>
      props.theme.palette.type === "dark"
        ? lighten(props.theme.palette.background.toolbar, 0.15)
        : darken(props.theme.palette.background.toolbar, 0.15)};
  }
`;

export function ResultsDisplayModeToggle({
  displayMode,
  setDisplayMode,
  modelName,
}) {
  return (
    <ToggleWrap item xs={12}>
      <ButtonGroup color="default" aria-label="outlined primary button group">
        <Tooltip title="Table View">
          <ToggleButton
            variant="outlined"
            className={{ active: displayMode === CRUD_DISPLAY_MODES.TABLE }}
          >
            <TableModeIcon
              onMouseDown={() => {
                localStorage.setItem(
                  `crudViewResultDisplayMode_${modelName}`,
                  CRUD_DISPLAY_MODES.TABLE
                );
                setDisplayMode(CRUD_DISPLAY_MODES.TABLE);
              }}
            />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="List View">
          <ToggleButton
            variant="outlined"
            className={{ active: displayMode === CRUD_DISPLAY_MODES.LIST }}
          >
            <ListModeIcon
              onMouseDown={() => {
                localStorage.setItem(
                  `crudViewResultDisplayMode_${modelName}`,
                  CRUD_DISPLAY_MODES.LIST
                );
                setDisplayMode(CRUD_DISPLAY_MODES.LIST);
              }}
            />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Card View">
          <ToggleButton
            variant="outlined"
            className={{ active: displayMode === CRUD_DISPLAY_MODES.CARD }}
          >
            <CardModeIcon
              onMouseDown={() => {
                localStorage.setItem(
                  `crudViewResultDisplayMode_${modelName}`,
                  CRUD_DISPLAY_MODES.CARD
                );
                setDisplayMode(CRUD_DISPLAY_MODES.CARD);
              }}
            />
          </ToggleButton>
        </Tooltip>
      </ButtonGroup>
    </ToggleWrap>
  );
}
