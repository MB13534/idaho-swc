import React from "react";
import { Switch } from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import styled from "styled-components/macro";
import { darken } from "@material-ui/core";

const Rotate = styled.div`
  transform: rotate(-90deg);
`;

function TogglePicker({ name, checked, setChecked }) {
  const handleChange = (e) => {
    setChecked(name, e.target.checked);
  };

  const CustomToggle = withStyles({
    switchBase: {
      color: "#F48FB1",
      "&$checked": {
        color: "#008FBA",
      },
      "&$checked + $track": {
        backgroundColor: darken("#008FBA", 0.25),
      },
    },
    checked: {},
    track: { backgroundColor: darken("#F48FB1", 0.25) },
  })(Switch);

  return (
    <Rotate>
      <CustomToggle checked={checked} onChange={handleChange} />
    </Rotate>
  );
}

export default TogglePicker;
