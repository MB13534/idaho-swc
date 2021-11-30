import React from "react";
import styled, { withTheme } from "styled-components/macro";

import {
  AppBar as MuiAppBar,
  Grid,
  Hidden,
  IconButton as MuiIconButton,
  Toolbar,
} from "@material-ui/core";

import { Menu as MenuIcon } from "@material-ui/icons";

import UserDropdown from "./UserDropdown";
import ThemesToggle from "./ThemesToggle";
import { THEME } from "../constants";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const AppBarComponent = ({ onDrawerToggle }) => (
  <React.Fragment>
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
          <Hidden mdUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid
            item
            xs
            style={{
              marginLeft: JSON.parse(localStorage.getItem("isMainSidebarOpen"))
                ? 0
                : THEME.MAIN_SIDEBAR_WIDTH,
            }}
          />
          <Grid item xs />
          <Grid item>
            <ThemesToggle />
            <UserDropdown />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
);

export default withTheme(AppBarComponent);
