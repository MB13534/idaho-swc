import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React from "react";

const props = {
  MuiButtonBase: {
    disableRipple: true,
  },
  MuiCardHeader: {
    titleTypographyProps: { variant: "h6" },
  },
  MuiTooltip: {
    arrow: true,
    placement: "top",
  },
  MuiBreadcrumbs: {
    separator: <NavigateNextIcon fontSize="small" />,
  },
};

export default props;
