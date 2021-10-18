import React from "react";
import { Divider, Grid, withWidth } from "@material-ui/core";

function EditFormDivider({ field }) {
  return (
    <Grid item xs={12}>
      <Divider />
    </Grid>
  );
}

export default withWidth()(EditFormDivider);
