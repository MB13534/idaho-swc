import React from "react";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import { Button as MuiButton } from "@material-ui/core";

const Root = styled.div`
  padding: ${(props) => props.theme.spacing(6)}px;
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

const Button = styled(MuiButton)`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

function Unauthorized() {
  const history = useHistory();

  return (
    <Root>
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        Unauthorized
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        {window.location.pathname}
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        You do not have permission to access this resource.
      </Typography>
      <Button
        onClick={() => {
          history.goBack();
        }}
        variant="contained"
        color="secondary"
      >
        Back to Previous Page
      </Button>
    </Root>
  );
}

export default Unauthorized;
