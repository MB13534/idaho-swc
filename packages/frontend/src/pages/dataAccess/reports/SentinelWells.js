import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";
import {
  // Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
} from "@material-ui/core";
// import Link from "@material-ui/core/Link";
// import { NavLink } from "react-router-dom";
import { spacing } from "@material-ui/system";
import Button from "@material-ui/core/Button";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px - 48px - 106px - 48px - 64px - 22px);
  position: relative;
  overflow: auto;
`;

const Spacer = styled.div(spacing);
const Divider = styled(MuiDivider)(spacing);

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  opacity: 0.75;D
`;

// const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const SentinelWells = () => {
  return (
    <>
      <Helmet title="Sentinel Well Dashboard" />
      <Typography variant="h3" gutterBottom display="inline">
        Sentinel Well Dashboard
      </Typography>

      {/*<Breadcrumbs aria-label="Breadcrumb" mt={2}>*/}
      {/*  <Link component={NavLink} exact to="/dashboard">*/}
      {/*    Dashboard*/}
      {/*  </Link>*/}
      {/*  <Typography>Sentinel Well Dashboard</Typography>*/}
      {/*</Breadcrumbs>*/}

      <Divider my={6} />

      <Container>
        {/*<iframe*/}
        {/*  src="https://datastudio.google.com/embed/reporting/687d4099-65cb-48ee-bdfe-60aba7bf94f8/page/VGt3B"*/}
        {/*  width="100%"*/}
        {/*  height="100%"*/}
        {/*  frameBorder="0"*/}
        {/*  title="Sentinel Well Dashboard"*/}
        {/*/>*/}
        <div style={{ width: "100%" }}>
          <a
            href="https://datastudio.google.com/u/0/reporting/19da1e18-c4cb-4c00-b9d3-145d59f6cc25/page/VGt3B"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src="/static/img/sentinel_wells_dash_ss.png"
              alt="sentinel well dash screenshot"
            />
          </a>
        </div>
      </Container>

      <Spacer mt={4}>
        <Subtitle variant="h5" gutterBottom component="span">
          Access the Full Dynamic Sentinel Well Dashboard:
        </Subtitle>

        <Button
          style={{ marginLeft: "10px" }}
          size="medium"
          color="primary"
          variant="contained"
          component="a"
          target="_blank"
          rel="noreferrer noopener"
          href="https://datastudio.google.com/u/0/reporting/19da1e18-c4cb-4c00-b9d3-145d59f6cc25/page/VGt3B"
        >
          Sentinel Well Dash
        </Button>
      </Spacer>
    </>
  );
};

export default SentinelWells;
