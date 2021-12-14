import React, { useEffect } from "react";
import {
  FormHelperText,
  isWidthDown,
  MenuItem,
  Select as MuiSelect,
  Typography,
  useTheme,
  withWidth,
} from "@material-ui/core";
import { EditFormFieldWrap } from "../EditFormFieldWrap";
import { DiffViewer } from "../DiffViewer";
import styled from "styled-components/macro";
import useService from "../../../hooks/useService";
import { findRawRecords, findRecords } from "../../../services/crudService";
import { useQuery } from "react-query";
import Loader from "../../Loader";
import { useApp } from "../../../AppProvider";

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

function EditFormSplitStringDropdown({
  data,
  // type,
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
  const app = useApp();
  const theme = useTheme();
  const service = useService({ toast: false });

  const oldValue = { ...currentVersion };
  const newValue = { ...valueCache };

  const options = field.typeConfig.options;
  const tableName = field.typeConfig.table || "";
  const tableKeyName = field.typeConfig.key || "id";
  const tableValueName = field.typeConfig.value || "name";
  const tableHasCrudFields = field.typeConfig.crud ?? true;
  const serviceMethod = tableHasCrudFields ? findRecords : findRawRecords;

  useEffect(() => {
    if (
      field.defaultValue !== null &&
      typeof field.defaultValue !== "undefined"
    ) {
      setFieldValue(field.key, field.defaultValue);
    }
  }, [field.defaultValue, setFieldValue, field.key]);

  const {
    isLoading,
    error,
    data: queryData,
  } = useQuery(
    [`${field.key}${tableName}${tableKeyName}${tableValueName}lookup`],
    async () => {
      if (tableName.length === 0 && options) {
        return { data: options };
      } else if (typeof tableName === "string" && tableName.length > 0) {
        try {
          let result = await service([serviceMethod, [tableName]]);
          return { data: result };
        } catch (err) {
          console.error(err);
          app.doToast("error", err);
        }
      }
    },
    { keepPreviousData: true }
  );

  const getValueByKey = (key) => {
    const result = queryData.data.find((x) => x[tableKeyName] === key);
    return result ? result[tableValueName] : null;
  };

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
      {error && (
        <Typography color="error">
          {"An error has occurred: " + error?.message}
        </Typography>
      )}
      {isLoading && <Loader />}
      {!error && !isLoading && (
        <React.Fragment>
          {!field.typeConfig && <>Field is missing 'typeConfig' object.</>}
          {!tableName && !options && (
            <>
              Field is missing 'typeConfig.table' or 'typeConfig.options'
              setting.
            </>
          )}
          {!tableKeyName && <>Field is missing 'typeConfig.key' setting.</>}
          {!tableValueName && <>Field is missing 'typeConfig.value' setting.</>}
          <MuiSelect
            name={field.key}
            value={values[field.key] ?? ""}
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
          >
            {!field.required && (
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            )}
            {queryData &&
              queryData.data &&
              queryData.data.map((item) => {
                return (
                  <MenuItem
                    key={item[tableKeyName]}
                    value={item[tableKeyName]}
                    style={{ whiteSpace: "normal", display: "block" }}
                  >
                    {typeof item[tableValueName] === "string"
                      ? item[tableValueName]
                          .split("; ")
                          .map((item) => <p key={item}>{item}</p>)
                      : item[tableValueName]}
                  </MenuItem>
                );
              })}
          </MuiSelect>

          {touched[field.key] && (
            <FormHelperText error>{errors[field.key]}</FormHelperText>
          )}

          {valueCache && currentVersion && (
            <DiffWrap
              className={
                newValue[field.key] === oldValue[field.key]
                  ? "match"
                  : "mismatch"
              }
            >
              <DiffViewer
                oldValue={String(getValueByKey(newValue[field.key]) || "")}
                newValue={String(getValueByKey(oldValue[field.key]) || "")}
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
        </React.Fragment>
      )}
    </EditFormFieldWrap>
  );
}

export default withWidth()(EditFormSplitStringDropdown);
