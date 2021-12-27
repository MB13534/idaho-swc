import React, { useEffect } from "react";
import {
  FormHelperText,
  InputAdornment,
  isWidthDown,
  useTheme,
  withWidth,
} from "@material-ui/core";
import { EditFormFieldWrap } from "../EditFormFieldWrap";
import { DiffViewer } from "../DiffViewer";
import styled from "styled-components/macro";
import {
  DatePicker as MuiDatePicker,
  DateTimePicker as MuiDateTimePicker,
  KeyboardDatePicker as MuiKeyboardDatePicker,
  KeyboardDateTimePicker as MuiKeyboardDateTimePicker,
  KeyboardTimePicker as MuiKeyboardTimePicker,
  TimePicker as MuiTimePicker,
} from "@material-ui/pickers";
import { CRUD_FIELD_TYPES, THEME } from "../../../constants";
import IconButton from "@material-ui/core/IconButton";
import { AccessTime, Event } from "@material-ui/icons";

const DiffWrap = styled.div`
  &.mismatch {
    border-bottom-left-radius: 4px;
    overflow: hidden;
    border-bottom-right-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-top: none;

    > table {
      margin-top: -1px;
      margin-bottom: -1px;
      font-size: 11px;

      [class*="-gutter"] {
        min-width: 30px;
      }

      [class*="-marker"] {
        display: none;
      }

      pre {
        line-height: 20px;
      }
    }
  }
`;

function EditFormDateTime({
  data,
  type,
  index,
  field,
  setFieldValue,
  currentVersion,
  hasError,
  toggleField,
  isFieldDirty,
  values,
  valueCache,
  touched,
  errors,
  handleBlur,
  handleChange,
  variant,
  width,
}) {
  const theme = useTheme();

  const oldValue = { ...currentVersion };
  const newValue = { ...valueCache };

  const config = field.typeConfig ?? {};

  config.icon = config.icon ?? true;

  const DateComponent = config.keyboard ? MuiKeyboardDatePicker : MuiDatePicker;
  const TimeComponent = config.keyboard ? MuiKeyboardTimePicker : MuiTimePicker;
  const DateTimeComponent = config.keyboard
    ? MuiKeyboardDateTimePicker
    : MuiDateTimePicker;
  useEffect(() => {
    if (
      field.defaultValue !== null &&
      typeof field.defaultValue !== "undefined" &&
      (data[field.key] === null ||
        typeof data[field.key] === "undefined" ||
        data[field.key] === "")
    ) {
      setFieldValue(field.key, field.defaultValue);
    }
  }, [field.defaultValue, setFieldValue, field.key, data]);

  return (
    <EditFormFieldWrap
      data={data}
      field={field}
      currentVersion={currentVersion}
      hasError={hasError}
      toggleField={toggleField}
      isFieldDirty={isFieldDirty}
      setFieldValue={setFieldValue}
    >
      {type === CRUD_FIELD_TYPES.DATE && (
        <DateComponent
          name={field.key}
          value={values[field.key] || null}
          error={hasError}
          fullWidth
          inputProps={{ tabIndex: index + 1 }}
          onBlur={handleBlur}
          onChange={(val) =>
            handleChange({ target: { name: field.key, value: val } })
          }
          className={
            valueCache &&
            currentVersion &&
            newValue[field.key] !== oldValue[field.key]
              ? "mismatch"
              : "match"
          }
          variant={config.variant ?? "inline"}
          format={config.format ?? THEME.DATE_FORMAT_SHORT}
          inputVariant={variant}
          // KeyboardButtonProps={config.keyboard ? { size: "small" } : undefined}
          InputProps={{
            endAdornment: config.icon && (
              <InputAdornment position="end">
                <IconButton size={"small"}>
                  <Event />
                </IconButton>
              </InputAdornment>
            ),
          }}
          my={2}
        />
      )}

      {type === CRUD_FIELD_TYPES.TIME && (
        <TimeComponent
          name={field.key}
          value={values[field.key] || null}
          error={hasError}
          fullWidth
          inputProps={{ tabIndex: index + 1 }}
          onBlur={handleBlur}
          onChange={(val) =>
            handleChange({ target: { name: field.key, value: val } })
          }
          className={
            valueCache &&
            currentVersion &&
            newValue[field.key] !== oldValue[field.key]
              ? "mismatch"
              : "match"
          }
          variant={config.variant ?? "inline"}
          format={config.format ?? THEME.TIME_FORMAT_SHORT}
          inputVariant={variant}
          // KeyboardButtonProps={config.keyboard ? { size: "small" } : undefined}
          keyboardIcon={<AccessTime />}
          InputProps={{
            endAdornment: config.icon && (
              <InputAdornment position="end">
                <IconButton size={"small"}>
                  <AccessTime />
                </IconButton>
              </InputAdornment>
            ),
          }}
          my={2}
        />
      )}

      {type === CRUD_FIELD_TYPES.DATETIME && (
        <DateTimeComponent
          name={field.key}
          value={values[field.key] || null}
          error={hasError}
          fullWidth
          inputProps={{ tabIndex: index + 1 }}
          onBlur={handleBlur}
          onChange={(val) =>
            handleChange({ target: { name: field.key, value: val } })
          }
          className={
            valueCache &&
            currentVersion &&
            newValue[field.key] !== oldValue[field.key]
              ? "mismatch"
              : "match"
          }
          variant={config.variant ?? "inline"}
          format={config.format ?? THEME.DATETIME_FORMAT_SHORT}
          inputVariant={variant}
          // KeyboardButtonProps={config.keyboard ? { size: "small" } : undefined}
          InputProps={{
            endAdornment: config.icon && (
              <InputAdornment position="end">
                <IconButton size={"small"}>
                  <Event />
                </IconButton>
              </InputAdornment>
            ),
          }}
          my={2}
        />
      )}

      {touched[field.key] && (
        <FormHelperText error>{errors[field.key]}</FormHelperText>
      )}

      {valueCache && currentVersion && (
        <DiffWrap
          className={
            newValue[field.key] === oldValue[field.key] ? "match" : "mismatch"
          }
        >
          <DiffViewer
            oldValue={newValue[field.key]}
            newValue={oldValue[field.key]}
            splitView={isWidthDown("xs", width) === false}
            useDarkTheme={theme.palette.type === "dark"}
            compareMethod={"diffWordsWithSpace"}
            onLineNumberClick={(lineId) => {
              const [side] = lineId.split("-");

              if (side === "L") {
                setFieldValue(field.key, newValue[field.key]);
              } else {
                setFieldValue(field.key, oldValue[field.key]);
              }
            }}
          />
        </DiffWrap>
      )}
    </EditFormFieldWrap>
  );
}

export default withWidth()(EditFormDateTime);
