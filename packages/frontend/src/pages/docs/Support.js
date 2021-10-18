import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import { Box, Link, Typography as MuiTypography } from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Typography = styled(MuiTypography)(spacing);

function Support() {
  return (
    <React.Fragment>
      <Helmet title="Support" />

      <Box mb={10}>
        <Typography variant="subtitle1" gutterBottom my={4}>
          If you have any issues, questions, comments, or bug reports, please
          send them to Doug Kulak:{" "}
          <Link href="mailto:dougkulak@gmail.com">dougkulak@gmail.com</Link>
          . Please describe your issue in detail and include any relevant links
          that may help me.
          <br />
          <br />
          See the following links for additional support:
          <ul>
            <li>
              <Link href="https://github.com/lre-water/up" target="_blank">
                GitHub Page
              </Link>
            </li>
          </ul>
        </Typography>
      </Box>
    </React.Fragment>
  );
}

export default Support;
