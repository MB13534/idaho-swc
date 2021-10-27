import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import { Box, Typography as MuiTypography, useTheme } from "@material-ui/core";

import { spacing } from "@material-ui/system";
import Code from "../../components/Code";

const Typography = styled(MuiTypography)(spacing);

function Cmd({ children }) {
  const theme = useTheme();

  return (
    <code style={{ color: theme.palette.secondary.main }}>{children}</code>
  );
}

function PullInstructions() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        How to Pull Changes from Unified Platform
      </Typography>
      <Typography variant="body1" gutterBottom my={4}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
        explicabo fugit, iste labore laudantium minima perspiciatis quidem
        similique! Cum cumque distinctio est expedita natus nobis officiis
        provident, quia reiciendis voluptatum.
      </Typography>
      <Cmd>...</Cmd>
      <Code>...</Code>
    </Box>
  );
}

function PushInstructions() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        How to Push Changes back to Unified Platform
      </Typography>
      <Typography variant="body1" gutterBottom my={4}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
        explicabo fugit, iste labore laudantium minima perspiciatis quidem
        similique! Cum cumque distinctio est expedita natus nobis officiis
        provident, quia reiciendis voluptatum.
      </Typography>
      <Cmd>...</Cmd>
      <Code>...</Code>
    </Box>
  );
}

function DeployInstructions() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        How to Deploy Project to Netlify/Heroku
      </Typography>
      <Typography variant="body1" gutterBottom my={4}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
        explicabo fugit, iste labore laudantium minima perspiciatis quidem
        similique! Cum cumque distinctio est expedita natus nobis officiis
        provident, quia reiciendis voluptatum.
      </Typography>
      <Cmd>...</Cmd>
      <Code>...</Code>
    </Box>
  );
}

function Deploy() {
  return (
    <React.Fragment>
      <Helmet title="Deploy" />

      <PullInstructions />
      <PushInstructions />
      <DeployInstructions />
    </React.Fragment>
  );
}

export default Deploy;
