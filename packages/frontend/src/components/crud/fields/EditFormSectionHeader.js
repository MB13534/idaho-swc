import React from "react";
import {
  Divider as MuiDivider,
  Grid,
  Typography,
  withWidth,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import styled from "styled-components/macro";

const Divider = styled(MuiDivider)(spacing);

function EditFormSectionHeader({ field }) {
  return (
    <Grid item xs={12}>
      <Typography variant={"h4"}>{field.title}</Typography>
      <Typography variant={"subtitle2"} color={"textSecondary"}>
        {field.subtitle}
      </Typography>
      <Divider mt={2} />
    </Grid>
  );
}

export default withWidth()(EditFormSectionHeader);
