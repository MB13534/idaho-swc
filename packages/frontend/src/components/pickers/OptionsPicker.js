import React from "react";

import { MenuItem, TextField as MuiTextField } from "@material-ui/core";

import styled from "styled-components/macro";

const TextField = styled(MuiTextField)`
  width: 100%;
`;

function OptionsPicker({ selectedOption, setSelectedOption, options, label }) {
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <TextField
      variant="outlined"
      select
      label={label}
      value={selectedOption}
      onChange={handleOptionChange}
      height="200px"
    >
      {options.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default OptionsPicker;
