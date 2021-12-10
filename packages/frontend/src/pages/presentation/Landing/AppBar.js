import React from "react";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants";
import {
  AppBar,
  Button as MuiButton,
  Container,
  Grid,
  isWidthDown,
  Toolbar,
  withWidth,
} from "@material-ui/core";

import ThemesToggle from "../../../components/ThemesToggle";

const Button = styled(MuiButton)(spacing);

const Brand = styled.div`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

const BrandIcon = styled.img`
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

function AppBarComponent({ width }) {
  return (
    <AppBar position="absolute" color="transparent" elevation={0}>
      <Toolbar>
        <Container>
          <Grid container alignItems="center">
            <Grid item>
              <Brand style={{ display: "flex", alignItems: "center" }}>
                <BrandIcon
                  src={`/static/img/clearwater-logo-simple.png`}
                  width="150"
                  height="48"
                  alt="Clearwater Icon"
                />{" "}
              </Brand>
            </Grid>
            <Grid item xs />
            <Grid item>
              <ThemesToggle />
              <Button
                ml={2}
                color="primary"
                variant="contained"
                component={Link}
                to={ROUTES.PAGE_DASHBOARD}
              >
                Launch{isWidthDown("xs", width) ? "" : " Dashboard"}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default withWidth()(AppBarComponent);
