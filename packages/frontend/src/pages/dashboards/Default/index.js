import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Accordion,
  AccordionDetails,
  Card,
  CardHeader,
  Divider as MuiDivider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid as MuiGrid,
  lighten,
  Radio,
  RadioGroup,
  Typography as MuiTypography,
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
import TimeseriesDateFilters from "../../../components/filters/TimeseriesDateFilters";
import SaveGraphButton from "../../../components/graphs/SaveGraphButton";
import ExportDataButton from "../../../components/graphs/ExportDataButton";
import OptionsPicker from "../../../components/pickers/OptionsPicker";
import Link from "@material-ui/core/Link";
import { Edit } from "@material-ui/icons";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  height: 100%;
  width: 100%;
`;

const MapContainer = styled.div`
  height: calc(400px);
  width: 100%;
`;

const TimeseriesContainer = styled.div`
  height: calc(600px - 146px);
  overflow-y: auto;
  width: 100%;
`;

const TimeseriesWrapper = styled.div`
  height: calc(100% - 54px);
  width: 100%;
`;

const FiltersContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const Grid = styled(MuiGrid)(spacing);

function Default() {
  const [map, setMap] = useState();
  const saveRef = useRef(null);
  const { user, getAccessTokenSilently } = useAuth0();
  const service = useService({ toast: false });
  const { currentUser } = useApp();

  //date filter defaults
  const defaultFilterValues = {
    startDate: null,
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
  const radioLabels = {
    all: "All",
    has_production: "Production",
    has_waterlevels: "Water Levels",
    has_wqdata: "Water Quality",
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    map.fire("closeAllPopups");
    setCurrentSelectedTimeseriesData(null);
    setCurrentSelectedPoint(null);
    setSelectedWQParameter(2);
  };

  const [filteredData, setFilteredData] = React.useState([]);
  const { data, isLoading, error } = useQuery(
    ["UiListWells", currentUser],
    async () => {
      try {
        const response = await service([findRawRecords, ["UiListWells"]]);
        //filters out any well that does not have geometry data
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

  //paramaters in picker that are selected by user
  const [selectedWQParameter, setSelectedWQParameter] = useState(2);
  const { data: wQparameterOptions } = useQuery(
    ["ListWQParameters", currentUser],
    async () => {
      try {
        const response = await service([findRawRecords, ["ListWQParameters"]]);
        return response.map((parameter) => ({
          label: parameter.wq_parameter_name,
          value: parameter.wq_parameter_ndx,
        }));
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
    if (currentSelectedPoint && radioValue !== "all") {
      async function send() {
        try {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };

          const endpoint = {
            has_production: "graph-wellproductions",
            has_waterlevels: "graph-depthtowater",
            has_wqdata: "graph-waterquality",
          };

          const { data: results } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint[radioValue]}/${currentSelectedPoint}`,
            {
              cuwcd_well_number: currentSelectedPoint,
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

  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState({});

  useEffect(() => {
    if (currentSelectedTimeseriesData?.length) {
      //mutate data for chartJS to use
      let graphData;
      if (radioValue === "has_production") {
        graphData = {
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
              borderWidth: 2,
              spanGaps: true,
            },
          ],
        };
      } else if (radioValue === "has_waterlevels") {
        graphData = {
          labels: currentSelectedTimeseriesData.map(
            (item) => new Date(item.collected_date)
          ),
          datasets: [
            {
              label: currentSelectedTimeseriesData[0].cuwcd_well_number,
              backgroundColor: lighten(lineColors.blue, 0.5),
              borderColor: lineColors.blue,
              data: currentSelectedTimeseriesData.map((item) => item.dtw_ft),
              borderWidth: 2,
              fill: true,
              maxBarThickness: 25,
            },
          ],
        };
      } else if (radioValue === "has_wqdata") {
        const parameterFilteredData = currentSelectedTimeseriesData.filter(
          (item) => item.wq_parameter_ndx === selectedWQParameter
        );
        graphData = {
          labels: parameterFilteredData.map((item) => new Date(item.test_date)),
          units: parameterFilteredData[0].unit_desc,
          parameter: parameterFilteredData[0].wq_parameter_name,
          datasets: [
            {
              label: parameterFilteredData[0].cuwcd_well_number,
              backgroundColor: lighten(lineColors.blue, 0.5),
              borderColor: lineColors.blue,
              data: parameterFilteredData.map((item) => item.result_value),
              pointStyle: "circle",
              borderWidth: 2,
              pointHoverRadius: 9,
              pointRadius: 7,
            },
          ],
        };
      }

      setFilteredMutatedGraphData(graphData);
    } else {
      setFilteredMutatedGraphData(null);
    }
  }, [currentSelectedTimeseriesData, selectedWQParameter]); // eslint-disable-line

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
      <Helmet title="Dashboard" />
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
                  map={map}
                  setMap={setMap}
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
                Graph Options
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={12} md={6}>
                    <FiltersContainer>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          Filter Wells by Their Available Data Types
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
                            label={radioLabels["all"]}
                          />
                          <FormControlLabel
                            value="has_production"
                            control={<Radio />}
                            label={radioLabels["has_production"]}
                          />
                          <FormControlLabel
                            value="has_waterlevels"
                            control={<Radio />}
                            label={radioLabels["has_waterlevels"]}
                          />
                          <FormControlLabel
                            value="has_wqdata"
                            control={<Radio />}
                            label={radioLabels["has_wqdata"]}
                          />
                        </RadioGroup>
                      </FormControl>
                    </FiltersContainer>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} mt={2}>
                    <TimeseriesDateFilters
                      filterValues={filterValues}
                      changeFilterValues={changeFilterValues}
                    />
                  </Grid>
                  {["has_wqdata", "all"].includes(radioValue) &&
                    wQparameterOptions && (
                      <Grid container spacing={6}>
                        <Grid item xs={12} mt={6}>
                          <OptionsPicker
                            selectedOption={selectedWQParameter}
                            setSelectedOption={setSelectedWQParameter}
                            options={wQparameterOptions}
                            label="Water Quality Parameters"
                          />
                        </Grid>
                      </Grid>
                    )}
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
                  {`Reported Well #${currentSelectedPoint} ${radioLabels[radioValue]} Summary`}
                </Typography>
              </AccordionSummary>
              <Panel>
                <AccordionDetails>
                  <TimeseriesContainer>
                    <Grid container pb={2}>
                      <Grid item style={{ flexGrow: 1 }} />
                      <Grid item>
                        <ExportDataButton
                          title="cuwcd_well_number"
                          data={currentSelectedTimeseriesData}
                          filterValues={filterValues}
                          parameter={selectedWQParameter}
                        />
                      </Grid>
                      <Grid item>
                        <SaveGraphButton
                          ref={saveRef}
                          title={currentSelectedPoint}
                        />
                      </Grid>
                    </Grid>
                    <TimeseriesWrapper>
                      <TimeseriesLineChart
                        data={filteredMutatedGraphData}
                        error={error}
                        isLoading={isLoading}
                        yLLabel={
                          radioValue === "has_waterlevels"
                            ? "Water Level (Feet Below Ground Level)"
                            : radioValue === "has_production"
                            ? "Groundwater Pumping (Acre-Feet)"
                            : `${filteredMutatedGraphData?.parameter} (${filteredMutatedGraphData?.units})`
                        }
                        reverseLegend={false}
                        yLReverse={radioValue === "has_waterlevels"}
                        ref={saveRef}
                        filterValues={filterValues}
                        type={radioValue === "has_wqdata" ? "bar" : "scatter"}
                      />
                    </TimeseriesWrapper>
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
              <CardHeader
                title={
                  radioValue === "all"
                    ? "Filter Data and Click a Point on the Map to View Corresponding Summary"
                    : `Select a Point on the Map to View ${radioLabels[radioValue]} Summary`
                }
              />
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
                    pageSize={10}
                    isLoading={isLoading}
                    label="Streamflow Timeseries Table"
                    columns={tableColumns}
                    data={filteredData}
                    height="390px"
                    actions={[
                      (rowData) => ({
                        icon: "bar_chart",
                        tooltip: "Production",
                        onClick: (event, rowData) => {
                          setRadioValue("has_production");
                          setCurrentSelectedPoint(rowData.cuwcd_well_number);
                          setCurrentSelectedTimeseriesData(null);
                          setSelectedWQParameter(2);
                          map.fire("closeAllPopups");
                          map.flyTo({
                            center: [rowData.longitude_dd, rowData.latitude_dd],
                            zoom: 16,
                          });
                        },
                        disabled: !rowData.has_production,
                      }),
                      (rowData) => ({
                        icon: "water",
                        tooltip: "Water Levels",
                        onClick: (event, rowData) => {
                          setRadioValue("has_waterlevels");
                          setCurrentSelectedPoint(rowData.cuwcd_well_number);
                          setCurrentSelectedTimeseriesData(null);
                          setSelectedWQParameter(2);
                          map.fire("closeAllPopups");
                          map.flyTo({
                            center: [rowData.longitude_dd, rowData.latitude_dd],
                            zoom: 16,
                          });
                        },
                        disabled: !rowData.has_waterlevels,
                      }),
                      (rowData) => ({
                        icon: "bloodtype",
                        tooltip: "Water Quality",
                        onClick: (event, rowData) => {
                          setRadioValue("has_wqdata");
                          setCurrentSelectedPoint(rowData.cuwcd_well_number);
                          setCurrentSelectedTimeseriesData(null);
                          // setSelectedWQParameter(2);
                          map.fire("closeAllPopups");
                          map.flyTo({
                            center: [rowData.longitude_dd, rowData.latitude_dd],
                            zoom: 16,
                          });
                        },
                        disabled: !rowData.has_wqdata,
                      }),
                      (rowData) => ({
                        icon: () => {
                          return (
                            <Link
                              component={NavLink}
                              exact
                              to={"/models/dm-wells/" + rowData.id}
                              // target="_blank"
                              // rel="noreferrer noopener"
                            >
                              <Edit />
                            </Link>
                          );
                        },
                        tooltip: "Edit Well",
                      }),
                      () => ({
                        icon: "near_me",
                        tooltip: "Fly to on Map",
                        onClick: (event, rowData) => {
                          map.fire("closeAllPopups");
                          map.flyTo({
                            center: [rowData.longitude_dd, rowData.latitude_dd],
                            zoom: 16,
                          });
                        },
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
