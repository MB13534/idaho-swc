import React, { useState } from "react";

import { Grid as MuiGrid } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import styled from "styled-components/macro";

import MultiChipPicker from "../pickers/MultiChipPicker";
import DatePicker from "../pickers/DatePicker";
import OptionsPicker from "../pickers/OptionsPicker";

const Grid = styled(MuiGrid)(spacing);

function ClearwaterFilters() {
  const [selectedDataSource, setSelectedDataSource] = React.useState("");
  const [selectedWaterQuality, setSelectedWaterQuality] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const initialSelectedWells = ["well1", "well30"];
  const [selectedWells, setSelectedWells] = useState(initialSelectedWells);

  const dataSource = [
    "Stream Stations",
    "Reservoir Stations",
    "Effluent Stations",
    "Mine Discharge Stations",
    "Spring Stations",
    "Groundwater Stations",
  ];

  const waterQuality = ["An-G", "Ag-T", "Al-D", "Al-T", "Alk", "As-D"];

  const wells = [
    "well1",
    "well2",
    "well3",
    "well4",
    "well5",
    "well6",
    "well7",
    "well8",
    "well9",
    "well10",
    "well11",
    "well12",
    "well13",
    "well14",
    "well15",
    "well16",
    "well17",
    "well18",
    "well19",
    "well20",
    "well21",
    "well22",
    "well23",
    "well24",
    "well25",
    "well26",
    "well27",
    "well28",
    "well29",
    "well30",
  ];

  return (
    <>
      <Grid container mb={6} spacing={6}>
        <Grid item xs={12} sm={12} md={6}>
          <OptionsPicker
            selectedOption={selectedDataSource}
            setSelectedOption={setSelectedDataSource}
            options={dataSource}
            label="Data Source"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <OptionsPicker
            selectedOption={selectedWaterQuality}
            setSelectedOption={setSelectedWaterQuality}
            options={waterQuality}
            label="Water Quality"
          />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={9} lg={8}>
          <MultiChipPicker
            options={wells}
            selectedOptions={selectedWells}
            setSelectedOptions={setSelectedWells}
            label={"Wells"}
            height={"108px"}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={4} style={{ margin: "auto" }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={12}>
              <DatePicker
                selectedDate={startDate}
                setSelectedDate={setStartDate}
                label="Start Date"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <DatePicker
                selectedDate={endDate}
                setSelectedDate={setEndDate}
                label="Start Date"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ClearwaterFilters;
