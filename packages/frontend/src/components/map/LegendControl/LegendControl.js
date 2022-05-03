import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const LegendControl = ({ open = false, onToggle, bottom = 30, right = 10 }) => {
  return (
    <Box
      bgcolor="#ffffff"
      boxShadow="0 0 0 2px rgba(0,0,0,.1)"
      borderRadius={4}
      position="absolute"
      zIndex={1}
      bottom={bottom}
      right={right}
      display="flex"
      flexDirection="column"
    >
      <Tooltip title="Legend">
        <IconButton
          size="small"
          color={open ? "secondary" : "default"}
          onClick={onToggle}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default LegendControl;
