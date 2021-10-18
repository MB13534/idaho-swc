import {
  AppBar as MuiAppBar,
  Grid,
  isWidthDown,
  isWidthUp,
  Typography,
  useTheme,
  withWidth,
} from "@material-ui/core";
import * as inflector from "inflected";
import { ResultsDisplayModeToggle } from "./ResultsDisplayModeToggle";
import React from "react";
import styled from "styled-components/macro";
import CreateModelButton from "./CreateModelButton";

const AppBar = styled(MuiAppBar)`
  min-height: 72px;
  justify-content: center;
  background-color: ${(props) => props.theme.palette.background.toolbar};
  border-bottom: 1px solid
    ${(props) =>
      props.theme.palette.type === "dark"
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.12)"};
  padding: ${(props) => props.theme.spacing(4)}px;

  ${(props) => props.theme.breakpoints.down("xs")} {
    max-height: none;
  }
`;

const GridButtonWrap = styled(Grid)`
  ${(props) => props.theme.breakpoints.down("xs")} {
    width: 100%;
    .MuiButtonGroup-root {
      width: 100%;

      & button:first-child {
        width: 100%;
      }
    }
  }
`;

function IndexAppBar({ modelName, width, displayMode, setDisplayMode }) {
  const theme = useTheme();

  return (
    <AppBar
      color="default"
      mb={4}
      style={{
        position: "sticky",
        top: isWidthDown("xs", width) ? "56px" : "64px",
      }}
    >
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{
          flexWrap: "nowrap",
          maxHeight: isWidthDown("xs", width) ? "none" : "39px",
        }}
      >
        <Grid
          item
          style={{
            flexBasis: "200%",
            paddingRight: theme.spacing(3),
            paddingLeft: theme.spacing(isWidthDown("sm", width) ? 0 : 4),
            width: isWidthUp("sm", width) ? "100%" : "auto",
          }}
        >
          <Typography variant="h5">
            {inflector.titleize(inflector.pluralize(modelName))}
          </Typography>
        </Grid>
        <Grid container item justify={"space-between"}>
          <Grid
            container
            justify="space-between"
            style={{ flexWrap: "nowrap" }}
          >
            <ResultsDisplayModeToggle
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              modelName={modelName}
            />
            <GridButtonWrap item>
              <CreateModelButton modelName={modelName} />
            </GridButtonWrap>
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
}

export default withWidth()(IndexAppBar);
