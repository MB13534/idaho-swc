import React from "react";

import {
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  FormControl as MuiFormControl,
  Chip as MuiChip,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import CancelIcon from "@material-ui/icons/Cancel";
import styled from "styled-components/macro";

const FormControl = styled(MuiFormControl)`
  width: 100%;
`;

const ChipContainer = styled.div`
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  overflow-y: auto;
`;

const Chip = styled(MuiChip)`
  margin: ${(props) => props.theme.spacing(0.5)}px;
`;

function MultiChipPicker({
  options,
  selectedOptions,
  setSelectedOptions,
  label,
  height = "148px",
}) {
  const handleChipChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const handleChipDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptions((current) => current.filter((item) => item !== value));
  };

  return (
    <FormControl variant="outlined">
      <InputLabel id="multiple-chip-checkbox-label">{label}</InputLabel>
      <Select
        labelId="multiple-chip-checkbox-label"
        id="multiple-chip-checkbox"
        label={label}
        multiple
        value={selectedOptions}
        onChange={handleChipChange}
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(selectedOptions) => (
          <ChipContainer style={{ height: height }}>
            {selectedOptions.map((value) => (
              <Chip
                key={value}
                label={value}
                clickable
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
                onDelete={(e) => handleChipDelete(e, value)}
              />
            ))}
          </ChipContainer>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={selectedOptions.includes(option)} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiChipPicker;
