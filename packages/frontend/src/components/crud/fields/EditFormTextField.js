import React, { useEffect } from "react";
import {
  TextField as MuiTextField,
  useTheme,
  withWidth,
  isWidthDown,
  FormHelperText,
} from "@material-ui/core";
import { CRUD_FIELD_TYPES } from "../../../constants";
import { EditFormFieldWrap } from "../EditFormFieldWrap";
import { DiffViewer } from "../DiffViewer";
import styled from "styled-components/macro";

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

function EditFormTextField({
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

  const isMultiline = type === CRUD_FIELD_TYPES.MULTILINE_TEXT;

  const oldValue = { ...currentVersion };
  const newValue = { ...valueCache };

  useEffect(() => {
    if (
      field.defaultValue !== null &&
      typeof field.defaultValue !== "undefined"
    ) {
      setFieldValue(field.key, field.defaultValue);
    }
  }, [field.defaultValue, setFieldValue, field.key]);

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
      <MuiTextField
        name={field.key}
        value={values[field.key] ?? ""}
        multiline={isMultiline}
        rows={5}
        error={hasError}
        fullWidth
        inputProps={{ tabIndex: index + 1 }}
        onBlur={handleBlur}
        onChange={handleChange}
        className={
          valueCache &&
          currentVersion &&
          newValue[field.key] !== oldValue[field.key]
            ? "mismatch"
            : "match"
        }
        variant={variant}
        my={2}
      />

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

              /* TODO: dkulak: apply selected line number only (work-in-progress)
              const leftLines = oldValue[field.key].split("\n");
              const rightLines = newValue[field.key].split("\n");

              if (side === "L") {
                if (isMultiline) {
                  const mergedLines = leftLines.map((x, i) => {
                    if (i === num - 1) {
                      return leftLines[i];
                    } else {
                      return x;
                    }
                  });
                  setFieldValue(field.key, mergedLines.join("\n"));
                } else {
                  setFieldValue(field.key, oldValue[field.key].join("\n"));
                }
              } else if (side === "R") {
                if (isMultiline) {
                  const mergedLines = rightLines.map((x, i) => {
                    if (i === num - 1) {
                      return rightLines[i];
                    } else {
                      return x;
                    }
                  });
                  setFieldValue(field.key, mergedLines.join("\n"));
                } else {
                  setFieldValue(field.key, newValue[field.key].join("\n"));
                }*/

              console.log(lineId);
            }}
          />
        </DiffWrap>
      )}
    </EditFormFieldWrap>
  );
}

export default withWidth()(EditFormTextField);
