import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import GraphIcon from "@material-ui/icons/List";

const DataVizControl = ({ open = false, onClose }) => {
  return (
    <Box
      bgcolor="#ffffff"
      boxShadow="0 0 0 2px rgba(0,0,0,.1)"
      borderRadius={4}
      position="absolute"
      zIndex={1}
      top={10}
      right={49}
      display="flex"
      flexDirection="column"
    >
      <Tooltip title="Detailed Results">
        <IconButton color={open ? "secondary" : "default"} onClick={onClose}>
          <GraphIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default DataVizControl;
