import React from "react";

import {
  Grid as MuiGrid,
  Typography as MuiTypography,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import styled from "styled-components/macro";
import InputPicker from "../pickers/InputPicker";
import TogglePicker from "../pickers/TogglePicker";
import DatePicker from "../pickers/DatePicker";

const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);
const PointerDiv = styled.div`
  cursor: pointer;
`;

function TimeseriesFilters({ filterValues, changeFilterValues }) {
  return (
    <>
      <Grid container mb={2} spacing={6} alignItems="center">
        <Grid item xs={12} sm={6}>
          <PointerDiv style={{ color: "#606368" }}>
            <Typography
              align="center"
              color={filterValues.checked ? "textPrimary" : "inherit"}
              onClick={() =>
                !filterValues.checked &&
                changeFilterValues("checked", !filterValues.checked)
              }
            >
              Show Last:
            </Typography>
          </PointerDiv>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputPicker
            label="Days"
            type="number"
            name="previousDays"
            value={filterValues.previousDays}
            setValue={changeFilterValues}
            checked={filterValues.checked}
          />
        </Grid>
      </Grid>

      <Typography variant="h2" align="center" mb={5}>
        <TogglePicker
          name="checked"
          checked={filterValues.checked}
          setChecked={changeFilterValues}
        />
      </Typography>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} sm={6}>
          <PointerDiv style={{ color: "#606368" }}>
            <Typography
              align="center"
              color={filterValues.checked ? "inherit" : "textPrimary"}
              onClick={() =>
                filterValues.checked &&
                changeFilterValues("checked", !filterValues.checked)
              }
            >
              Show Date Range:
            </Typography>
          </PointerDiv>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <DatePicker
                label="Select Start Date"
                name="startDate"
                selectedDate={filterValues.startDate}
                setSelectedDate={changeFilterValues}
                checked={filterValues.checked}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Select End Date"
                name="endDate"
                selectedDate={filterValues.endDate}
                setSelectedDate={changeFilterValues}
                checked={filterValues.checked}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default TimeseriesFilters;
