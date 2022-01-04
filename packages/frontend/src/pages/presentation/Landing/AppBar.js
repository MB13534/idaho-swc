import React from "react";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar,
  Button as MuiButton,
  Container,
  Grid,
  isWidthDown,
  Toolbar,
  Tooltip,
  withWidth,
} from "@material-ui/core";

import ThemesToggle from "../../../components/ThemesToggle";
import { ROUTES } from "../../../constants";
import Link from "@material-ui/core/Link";

const Button = styled(MuiButton)(spacing);

const BrandIcon = styled.img`
  margin-right: ${(props) => props.theme.spacing(2)}px;
  display: flex;
  align-items: center;
`;

function AppBarComponent({ width }) {
  const { loginWithRedirect } = useAuth0();
  return (
    <AppBar position="absolute" color="transparent" elevation={0}>
      <Toolbar>
        <Container>
          <Grid container alignItems="center">
            <Grid item>
              <Link
                href="https://lrewater.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Tooltip title="Built by LRE Water">
                  <BrandIcon
                    src={`/static/img/lrewater-logo-simple.svg`}
                    width={isWidthDown("xs", width) ? "125" : "150"}
                    height={isWidthDown("xs", width) ? "40" : "48"}
                    alt={"LREWater.com"}
                  />
                </Tooltip>
              </Link>
            </Grid>

            <Grid item xs />
            <Grid item>
              <ThemesToggle />
              <Button
                ml={2}
                color="primary"
                variant="contained"
                onClick={() =>
                  loginWithRedirect({
                    appState: { returnTo: ROUTES.PAGE_DASHBOARD },
                  })
                }
              >
                {isWidthDown("xs", width) ? "Login" : "Log in to Dashboard"}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default withWidth()(AppBarComponent);
