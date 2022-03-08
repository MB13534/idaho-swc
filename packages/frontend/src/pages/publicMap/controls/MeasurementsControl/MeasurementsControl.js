import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import RulerIcon from "@material-ui/icons/SquareFoot";

const MeasurementsControl = ({
  open = false,
  onToggle,
  bottom = 38,
  right = 59,
}) => {
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
      <Tooltip title="Measurements Details">
        <IconButton
          size="small"
          color={open ? "secondary" : "default"}
          onClick={onToggle}
        >
          <RulerIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default MeasurementsControl;
