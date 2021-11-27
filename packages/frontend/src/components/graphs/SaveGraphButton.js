import React, { forwardRef } from "react";

import { withTheme } from "styled-components/macro";
import { Tooltip as MuiTooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import { spacing } from "@material-ui/system";

import styled from "styled-components/macro";

import { downloadChartImage } from "../../utils";

const Tooltip = styled(MuiTooltip)(spacing);

const SaveGraphButton = forwardRef(({ theme, title }, ref) => {
  return (
    <Tooltip title="Save Graph" arrow ml={2}>
      <IconButton
        onClick={() => downloadChartImage(title, "png", ref)}
        style={{
          color:
            theme.palette.type === "dark"
              ? "rgba(255, 255, 255, 0.5)"
              : "rgb(117, 117, 117)",
        }}
        aria-label="download graph"
        component="span"
      >
        <SaveIcon />
      </IconButton>
    </Tooltip>
  );
});
export default withTheme(SaveGraphButton);
