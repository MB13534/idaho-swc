import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import { Box, Typography as MuiTypography } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Code from "../../components/Code";

const Typography = styled(MuiTypography)(spacing);

function QuickStart() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Quick start
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque
        dignissimos dolores earum enim, ipsa ipsum iusto, maiores nemo nobis
        officiis quae rerum sed sunt ullam voluptatum. Asperiores nobis porro
        rem?
        <Code>yarn install</Code>
      </Typography>
    </Box>
  );
}

function GettingStarted() {
  return (
    <React.Fragment>
      <Helmet title="Getting Started" />

      <QuickStart />
    </React.Fragment>
  );
}

export default GettingStarted;
