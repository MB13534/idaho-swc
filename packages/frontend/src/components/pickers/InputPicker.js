import React from "react";

import { TextField as MuiTextField } from "@material-ui/core";

import styled from "styled-components/macro";

const TextField = styled(MuiTextField)`
  width: 100%;
`;

function InputPicker({ label, type, name, value, setValue, checked }) {
  const handleChange = (e) => {
    setValue(name, e.target.value);
  };

  return (
    <TextField
      variant="outlined"
      label={label}
      type={type}
      value={value}
      onChange={handleChange}
      disabled={!checked}
    />
  );
}

export default InputPicker;
