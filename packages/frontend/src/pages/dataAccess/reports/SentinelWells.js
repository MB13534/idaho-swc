import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { NavLink } from "react-router-dom";
import { spacing } from "@material-ui/system";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px - 48px - 106px - 48px - 64px);
  position: relative;
`;

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const SentinelWells = () => {
  return (
    <>
      <Helmet title="Sentinel Wells" />
      <Typography variant="h3" gutterBottom display="inline">
        Sentinel Wells
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Sentinel Wells Info</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Container>
        <iframe
          src="https://datastudio.google.com/embed/reporting/19da1e18-c4cb-4c00-b9d3-145d59f6cc25/page/VGt3B"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Sentinel Wells"
        />
      </Container>
    </>
  );
};

export default SentinelWells;
