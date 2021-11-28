import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Accordion,
  AccordionDetails,
  lighten,
  CardHeader,
  Card,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Actions from "./Actions";

import { useAuth0 } from "@auth0/auth0-react";
import Panel from "../../../components/panels/Panel";
import Map from "../../../components/map/Map";
import { useQuery } from "react-query";
import { findRawRecords } from "../../../services/crudService";
import useService from "../../../hooks/useService";
import { useApp } from "../../../AppProvider";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "../../../components/Table";
import axios from "axios";
import TimeseriesLineChart from "../../../components/graphs/TimeseriesLineChart";
import { lineColors, renderStatusChip } from "../../../utils";
import { add } from "date-fns";
import TimeseriesDateFilters from "../../../components/filters/TimeseriesDateFilters";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  height: calc(100% - 84px);
  width: 100%;
`;

const MapContainer = styled.div`
  height: calc(400px);
  width: 100%;
`;

const TimeseriesContainer = styled.div`
  height: 600px;
  overflow-y: auto;
  width: 100%;
`;

const FiltersContainer = styled.div`
  height: 100%;
  width: 100%;
`;

function Default() {
  const saveRef = useRef(null);
  const { user, getAccessTokenSilently } = useAuth0();

  //date filter defaults
  const defaultFilterValues = {
    startDate: add(new Date().getTime(), { days: -365 }),
    endDate: new Date(),
  };
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const changeFilterValues = (name, value) => {
    setFilterValues((prevState) => {
      let newFilterValues = { ...prevState };
      newFilterValues[name] = value;
      return newFilterValues;
    });
  };

  const [radioValue, setRadioValue] = React.useState("all");

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const service = useService({ toast: false });
  const { currentUser } = useApp();

  const [filteredData, setFilteredData] = React.useState([]);
  const { data, isLoading, error } = useQuery(
    ["UiListWells", currentUser],
    async () => {
      try {
        const response = await service([findRawRecords, ["UiListWells"]]);
        const filterData = response.filter(
          (location) => location.location_geometry
        );
        setFilteredData(filterData);
        return filterData;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (data?.length > 0) {
      if (radioValue === "all") {
        setFilteredData(data);
      } else {
        setFilteredData(data.filter((item) => item[radioValue]));
      }
    }
  }, [radioValue, data]);

  const [currentSelectedPoint, setCurrentSelectedPoint] = useState(null);
  const [currentSelectedTimeseriesData, setCurrentSelectedTimeseriesData] =
    useState(null);

  useEffect(() => {
    if (currentSelectedPoint) {
      async function send() {
        try {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          const { data: results } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/graph-wellproductions/${currentSelectedPoint}`,
            {
              well_ndx: currentSelectedPoint,
            },
            { headers }
          );

          if (results.length) {
            setCurrentSelectedTimeseriesData(results);
          } else {
            setCurrentSelectedTimeseriesData(null);
          }
        } catch (err) {
          // Is this error because we cancelled it ourselves?
          if (axios.isCancel(err)) {
            console.log(`call was cancelled`);
          } else {
            console.error(err);
          }
        }
      }
      send();
    }
  }, [currentSelectedPoint]); // eslint-disable-line

  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState([]);

  useEffect(() => {
    if (currentSelectedTimeseriesData?.length) {
      //mutate data for chartJS to use
      const graphData = {
        labels: currentSelectedTimeseriesData.map(
          (item) => new Date(item.report_year, item.report_month)
        ),
        datasets: [
          {
            label: currentSelectedTimeseriesData[0].cuwcd_well_number,
            backgroundColor: lighten(lineColors.blue, 0.5),
            borderColor: lineColors.blue,
            data: currentSelectedTimeseriesData.map(
              (item) => item.production_gallons
            ),
            pointStyle: "point",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: true,
            spanGaps: true,
          },
        ],
      };
      setFilteredMutatedGraphData(graphData);
    } else {
      setFilteredMutatedGraphData(null);
    }
  }, [currentSelectedTimeseriesData]);

  const tableColumns = [
    {
      title: "CUWCD Well Name",
      field: "cuwcd_well_number",
    },
    { title: "State Well Name", field: "state_well_number" },
    { title: "Source Aquifer", field: "source_aquifer" },
    { title: "Primary Well Use", field: "primary_use" },
    { title: "Current Owner", field: "well_owner" },
    {
      title: "Well Status",
      field: "well_status",
      render: (rowData) => {
        return renderStatusChip(rowData.well_status);
      },
    },
  ];

  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Welcome back, {user?.nickname}!
          </Typography>
        </Grid>

        <Grid item>
          <Actions />
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="map"
              id="map"
            >
              <Typography variant="h4" ml={2}>
                Map
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MapContainer>
                <Map
                  data={filteredData}
                  isLoading={isLoading}
                  error={error}
                  setCurrentSelectedPoint={setCurrentSelectedPoint}
                  radioValue={radioValue}
                />
              </MapContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="date-filters"
              id="date-filters"
            >
              <Typography variant="h4" ml={2}>
                Data Filters
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={12} md={6}>
                    <FiltersContainer>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          {/*Do you want a label?*/}
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="data"
                          name="data"
                          value={radioValue}
                          onChange={handleRadioChange}
                        >
                          <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label="All"
                          />
                          <FormControlLabel
                            value="has_production"
                            control={<Radio />}
                            label="Production"
                          />
                          <FormControlLabel
                            value="has_waterlevels"
                            control={<Radio />}
                            label="Water Levels"
                          />
                          <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label="Virtual Bore"
                          />
                          <FormControlLabel
                            value="has_wqdata"
                            control={<Radio />}
                            label="Water Quality"
                          />
                        </RadioGroup>
                      </FormControl>
                    </FiltersContainer>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <TimeseriesDateFilters
                      filterValues={filterValues}
                      changeFilterValues={changeFilterValues}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>

      {Boolean(filteredMutatedGraphData) ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="time-series"
                id="time-series"
              >
                <Typography variant="h4" ml={2}>
                  Well Production Time Series
                </Typography>
              </AccordionSummary>
              <Panel>
                <AccordionDetails>
                  <TimeseriesContainer>
                    <TimeseriesLineChart
                      data={filteredMutatedGraphData}
                      error={error}
                      isLoading={isLoading}
                      yLLabel="Acre-Feet"
                      reverseLegend={false}
                      ref={saveRef}
                      filterValues={filterValues}
                    />
                  </TimeseriesContainer>
                </AccordionDetails>
              </Panel>
            </Accordion>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="No Time Series Data Available for Selected Well" />
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="table-content"
              id="table-header"
            >
              <Typography variant="h4" ml={2}>
                Search Wells
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TableWrapper>
                  <Table
                    pageSize={5}
                    isLoading={isLoading}
                    label="Streamflow Timeseries Table"
                    columns={tableColumns}
                    data={filteredData}
                    height="195px"
                    actions={[
                      (rowData) => ({
                        icon: "bar_chart",
                        tooltip: "Production",
                        onClick: (event, rowData) =>
                          setCurrentSelectedPoint(rowData.well_ndx),
                        disabled: !rowData.has_production,
                      }),
                      (rowData) => ({
                        icon: "water",
                        tooltip: "Water Levels",
                        onClick: (event, rowData) =>
                          setCurrentSelectedPoint(rowData.well_ndx),
                        disabled: !rowData.has_waterlevels,
                      }),
                      () => ({
                        icon: "desktop_windows",
                        tooltip: "Virtual Bore",
                        onClick: (event, rowData) =>
                          setCurrentSelectedPoint(rowData.well_ndx),
                        disabled: true,
                      }),
                      (rowData) => ({
                        icon: "bloodtype",
                        tooltip: "Water Quality",
                        onClick: (event, rowData) =>
                          setCurrentSelectedPoint(rowData.well_ndx),
                        disabled: !rowData.has_wqdata,
                      }),
                    ]}
                  />
                </TableWrapper>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Default;
