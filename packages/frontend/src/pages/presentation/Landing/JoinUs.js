import React from "react";
import styled from "styled-components/macro";

import {
  Button,
  Container,
  Grid,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
// import { ROUTES } from "../../../constants";
import { useAuth0 } from "@auth0/auth0-react";

const Spacer = styled.div(spacing);

const Typography = styled(MuiTypography)(spacing);

const Wrapper = styled.div`
  ${spacing};
  text-align: center;
  position: relative;
  background: ${(props) => props.theme.palette.background.paper};
  color: ${(props) => props.theme.palette.text};
`;

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  opacity: 0.75;D
`;

function JoinUs() {
  const { loginWithRedirect } = useAuth0();
  return (
    <Wrapper pt={16} pb={16}>
      <Container>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Typography variant="h2" gutterBottom>
              Access the Platform
            </Typography>
            <Subtitle variant="h5" gutterBottom>
              Log in with user profile:
            </Subtitle>
            <Spacer mb={4} />

            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                loginWithRedirect({
                  appState: { returnTo: "/watershed-overview/map-of-sites" },
                })
              }
            >
              View Dashboard
            </Button>

            <Spacer mb={10} />
            <Subtitle variant="h5" gutterBottom>
              View public resources:
            </Subtitle>
            <Spacer mb={4} />
            <Button
              color="primary"
              variant="outlined"
              component={Link}
              to="/watershed-overview/map-of-sites"
              ml={50}
            >
              Public Access
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default JoinUs;
