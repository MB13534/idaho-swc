import { useRef, useState } from "react";
import {
  Box,
  FormControl,
  ClickAwayListener,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Popper,
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

const Filter = ({
  label,
  name,
  onChange = () => {},
  onSelectAll,
  onSelectNone,
  options = [],
  value = [],
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [hasFilterBeenOpened, setHasFilterBeenOpened] = useState(false);

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
          active && hasFilterBeenOpened ? (
            <FilterAvatar>{value.length}</FilterAvatar>
          ) : undefined
        }
        onClick={() => {
          setOpen((s) => !s);
          setHasFilterBeenOpened(true);
        }}
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
            <Typography variant="subtitle1">{label}</Typography>
            <Box display="flex" gridColumnGap={8} mt={2}>
              <Button
                size="small"
                startIcon={<PlusIcon />}
                onClick={() => onSelectAll(name)}
                variant="outlined"
              >
                Select All
              </Button>
              <Button
                size="small"
                startIcon={<MinusIcon />}
                onClick={() => onSelectNone(name)}
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
                    <li key={option.value}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={value.includes(option.value)}
                            onChange={onChange}
                            name={name}
                            value={option.value}
                          />
                        }
                        label={option.display}
                      />
                    </li>
                  ))}
                </ul>
              </FormControl>
            </Box>
          </FilterContainer>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default Filter;
