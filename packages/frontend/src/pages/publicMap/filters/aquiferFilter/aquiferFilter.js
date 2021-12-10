import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  FormControl,
  ClickAwayListener,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Popper,
  Divider,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";

const FilterAvatar = styled("span")(({ theme }) => ({
  alignItems: "center",
  backgroundColor: "#ffffff",
  borderRadius: "50%",
  color: theme.palette.primary.main,
  display: "flex",
  fontSize: "13px!important",
  justifyContent: "center",
  height: theme.spacing(4.5),
  width: theme.spacing(4.5),
}));

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: 400,
}));

const AquiferFilter = ({
  label,
  multi,
  name,
  onChange = () => {},
  onSelectAll,
  onSelectNone,
  options = [],
  value = [],
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const active = value?.length > 0;

  const handleClose = (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button
        color={active ? "primary" : "inherit"}
        size="large"
        variant={active ? "contained" : "outlined"}
        startIcon={
          active ? <FilterAvatar>{value.length}</FilterAvatar> : undefined
        }
        onClick={() => setOpen((s) => !s)}
        ref={buttonRef}
      >
        {label}
      </Button>
      <Popper
        open={open}
        anchorEl={buttonRef?.current}
        placement="bottom-start"
        style={{ zIndex: 2, border: "1px solid #ddd" }}
        transition
      >
        <ClickAwayListener onClickAway={handleClose}>
          <FilterContainer>
            <Typography variant="subtitle1">Aquifers</Typography>
            <Box display="flex" gridColumnGap={8} mt={2}>
              <Button
                startIcon={<PlusIcon />}
                onClick={() => onSelectAll("aquifers")}
                variant="outlined"
              >
                Select All
              </Button>
              <Button
                startIcon={<MinusIcon />}
                onClick={() => onSelectNone("aquifers")}
                variant="outlined"
              >
                Select None
              </Button>
            </Box>
            <Box>
              <FormControl component="fieldset">
                <ul
                  style={{ paddingLeft: 0, listStyle: "none", columnCount: 2 }}
                >
                  {options.map((option) => (
                    <li key={option.aquifer_name}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={value.includes(option.aquifer_name)}
                            onChange={onChange}
                            name="aquifers"
                            value={option.aquifer_name}
                          />
                        }
                        label={option.aquifer_name}
                      />
                    </li>
                  ))}
                </ul>
                {/* <FormHelperText>Be careful</FormHelperText> */}
              </FormControl>
            </Box>
          </FilterContainer>
        </ClickAwayListener>
      </Popper>
    </div>
    // <FormControl variant="outlined">
    //   <InputLabel id="demo-simple-select-label">{label}</InputLabel>
    //   <Select
    //     id="demo-simple-select"
    //     labelId="demo-simple-select-label"
    //     name={name}
    //     onChange={onChange}
    //     value={value}
    //   >
    //     {options.map(({ display, value }) => (
    //       <MenuItem key={value} value={value}>
    //         {display}
    //       </MenuItem>
    //     ))}
    //   </Select>
    // </FormControl>
  );
};

export default AquiferFilter;
