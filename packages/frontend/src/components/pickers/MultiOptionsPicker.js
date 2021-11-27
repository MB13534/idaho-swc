import React from "react";

import {
  InputLabel,
  MenuItem,
  Select,
  FormControl as MuiFormControl,
} from "@material-ui/core";

import styled from "styled-components/macro";

const FormControl = styled(MuiFormControl)`
  width: 100%;
  // margin-top: ${(props) => props.theme.spacing(2)}px;
`;

function MultiOptionsPicker({
  options,
  selectedOptions,
  setSelectedOptions,
  label,
}) {
  const handleOptionsChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        // width: 250,
      },
    },
  };

  return (
    <FormControl variant="outlined">
      <InputLabel id="multiple-options-label">{label}</InputLabel>
      <Select
        labelId="multiple-options-label"
        id="multiple-options"
        label={label}
        multiple
        value={selectedOptions}
        onChange={handleOptionsChange}
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiOptionsPicker;
