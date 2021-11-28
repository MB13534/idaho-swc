import React from "react";

import { Grid as MuiGrid } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import styled from "styled-components/macro";
import DatePicker from "../pickers/DatePicker";

const Grid = styled(MuiGrid)(spacing);

function TimeseriesDateFilters({ filterValues, changeFilterValues }) {
  return (
    <>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Select Start Date"
                name="startDate"
                selectedDate={filterValues.startDate}
                setSelectedDate={changeFilterValues}
                checked={filterValues.checked}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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

export default TimeseriesDateFilters;
