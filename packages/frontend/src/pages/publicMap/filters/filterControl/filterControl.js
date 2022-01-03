import { useRef, useState } from "react";
import {
  ClickAwayListener,
  Fade,
  Button,
  Paper,
  Popper,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

const FilterAvatar = styled("span")(({ theme }) => ({
  alignItems: "center",
  backgroundColor: "#ffffff",
  borderRadius: "50%",
  color: theme.palette.primary.main,
  display: "flex",
  fontSize: "12px!important",
  justifyContent: "center",
  //MJB change size from 5 to 4
  height: theme.spacing(4),
  width: theme.spacing(4),
}));

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const FilterControl = ({ appliedCount, children, label }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  // const [hasFilterBeenOpened, setHasFilterBeenOpened] = useState(false);

  const active = appliedCount > 0;

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
        //MJB change size from large to small
        size="small"
        variant={active ? "contained" : "outlined"}
        startIcon={
          active ? <FilterAvatar>{appliedCount}</FilterAvatar> : undefined
        }
        onClick={() => {
          setOpen((s) => !s);
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
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps} timeout={350}>
              <FilterContainer>{children}</FilterContainer>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </div>
  );
};

export default FilterControl;
