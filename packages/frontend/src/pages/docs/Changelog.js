import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import {
  Box,
  Chip as MuiChip,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Chip = styled(MuiChip)`
  height: 20px;
  margin-top: -3px;
  font-weight: ${(props) => props.theme.typography.fontWeightXBold};
  font-size: 75%;
`;

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Changelog() {
  return (
    <React.Fragment>
      <Helmet title="Changelog" />

      <Box mt={3}>
        <Typography variant="subtitle1">
          <Chip color="secondary" label="v0.1.1" /> – MMM DD, YYYY
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
            <li>Aliquam atque cumque doloremque earum est fugiat.</li>
            <li>Illum ipsam minus nam natus necessitatibus, non rem.</li>
            <li>Ased tempore, totam ullam vel vitae voluptatum.</li>
          </ul>
        </Typography>
        <Divider my={6} />

        <Typography variant="subtitle1">
          <Chip color="secondary" label="v0.1.0" /> – Oct 18, 2021
          <ul>
            <li>Initial release</li>
          </ul>
        </Typography>
      </Box>
    </React.Fragment>
  );
}

export default Changelog;
