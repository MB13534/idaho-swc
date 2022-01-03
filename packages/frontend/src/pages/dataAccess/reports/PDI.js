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

const PDI = () => {
  return (
    <>
      <Helmet title="PDI" />
      <Typography variant="h3" gutterBottom display="inline">
        Precipitation Drought Index Report
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Precipitation Drought Index</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Container>
        <iframe
          src="https://datastudio.google.com/embed/reporting/b40263bb-23cc-4694-b102-960ecd69df27/page/V0aiC"
          width="100%"
          height="100%"
          frameBorder="0"
          title="PDI"
        />
      </Container>
    </>
  );
};

export default PDI;
