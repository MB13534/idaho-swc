import React from "react";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import { Button } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";

const Alert = styled(MuiAlert)(spacing);

export default function Alerts() {
  return (
    <React.Fragment>
      <Alert mb={4} variant="filled" severity="error">
        This is an error alert — check it out!
      </Alert>
      <Alert mb={4} variant="filled" severity="warning">
        This is a warning alert — check it out!
      </Alert>
      <Alert mb={4} variant="filled" severity="info">
        This is an info alert — check it out!
      </Alert>
      <Alert mb={4} variant="filled" severity="success">
        This is a success alert (filled variant) — check it out!
      </Alert>
      <Alert mb={4} variant="outlined" severity="success">
        This is a success alert (outlined variant) — check it out!
      </Alert>
      <Alert mb={4} severity="success">
        This is a success alert (default variant) — check it out!
      </Alert>
      <Alert mb={4} onClose={() => {}}>
        This is a success alert — check it out!
      </Alert>
      <Alert
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
      >
        This is a success alert — check it out!!
      </Alert>
    </React.Fragment>
  );
}
