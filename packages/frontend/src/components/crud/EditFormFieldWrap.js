import React from "react";
import styled from "styled-components/macro";
import { Chip as MuiChip, Grid, Typography } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { ArrowDropDown, ArrowRight } from "@material-ui/icons";
import { rgba } from "polished";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";

const Root = styled(Grid)`
  .mismatch {
    & .MuiInputBase-root {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    & .MuiOutlinedInput-notchedOutline {
      border-bottom: none;
    }

    & .MuiOutlinedInput-notchedOutline:hover + {
    }
  }

  .MuiFormControl-root.mismatch:hover + .mismatch {
    border-color: black;
  }

  .MuiFormControl-root.mismatch:focus-within + .mismatch {
    border-color: ${(props) => props.theme.palette.primary.main};
    border-width: 2px;
  }

  .error .MuiFormControl-root.mismatch + .mismatch {
    border-color: ${(props) => props.theme.palette.error.main};
  }

  .MuiFormControl-root {
    position: unset;
  }

  .MuiFormHelperText-root.Mui-error {
    position: absolute;
    bottom: 0px;
  }
`;

const Chip = styled(MuiChip)`
  white-space: nowrap;
  height: 20px;
  font-size: 0.7rem;
  background: ${(props) => props.theme.palette.background.default};

  .MuiChip-label {
    padding: 0 6px;
  }
`;

const Label = styled(Typography)`
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  margin-bottom: ${(props) => props.theme.spacing(3)}px;

  &.dirty {
    color: white;
    background-color: ${(props) =>
      props.theme.palette.type === "dark"
        ? props.theme.palette.primary.dark
        : props.theme.palette.primary.light};

    padding: 0 8px;
    border-radius: 4px;
  }
`;

const FieldIconLess = styled(ArrowRight)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const FieldIconMore = styled(ArrowDropDown)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const FieldToggleIcon = styled(IconButton)`
  position: absolute;
  top: 20px;
  left: -2px;
  width: 18px;
  height: 18px;
  border-radius: 2px;

  &,
  &:active,
  &:focus,
  &:focus-within {
    background-color: ${(props) => props.theme.palette.background.toolbar};
  }

  svg {
    position: absolute;
    width: 22px;
    height: 22px;
  }

  @media (hover: none) {
    &:hover {
      background-color: ${(props) => props.theme.palette.background.toolbar};
    }
  }
`;

const FieldItem = styled.div`
  border-left: 3px solid
    ${(props) =>
      props.theme.palette.type === "dark"
        ? props.theme.header.background
        : props.theme.palette.background.toolbar};
  padding-left: 12px;

  &.error {
    border-color: red;
  }
`;

export function EditFormFieldWrap({
  data,
  children,
  field,
  hasError,
  toggleField,
  isFieldDirty,
  setFieldValue,
}) {
  return (
    <Root
      item
      xs={12}
      md={field.cols || 12}
      style={{
        position: "relative",
        paddingBottom: field.isOpen ? "20px" : "0px",
      }}
    >
      <FieldItem className={hasError ? "error" : ""}>
        <Grid container justify={"space-between"}>
          <Grid item>
            <FieldToggleIcon
              size={"small"}
              onClick={() => {
                toggleField(field.key);
              }}
            >
              {field.isOpen ? <FieldIconMore /> : <FieldIconLess />}
            </FieldToggleIcon>
            <Label
              color={hasError ? "error" : "textPrimary"}
              className={isFieldDirty ? "dirty" : ""}
              style={{ display: "inline-block" }}
            >
              {isFieldDirty ? (
                <>
                  <Tooltip title="Has unsaved changes.">
                    <span>{field.name}</span>
                  </Tooltip>
                </>
              ) : (
                field.name
              )}
            </Label>
            {isFieldDirty && (
              <Tooltip title="Discard changes.">
                <Link
                  onClick={() => setFieldValue(field.key, data[field.key])}
                  style={{
                    marginLeft: "16px",
                    fontSize: "11px",
                    color: "#999",
                    cursor: "pointer",
                  }}
                >
                  Discard
                </Link>
              </Tooltip>
            )}
          </Grid>
          <Grid item>{field.required && <Chip label={"Required"} />}</Grid>
        </Grid>

        {field.isOpen && children}
      </FieldItem>
    </Root>
  );
}
