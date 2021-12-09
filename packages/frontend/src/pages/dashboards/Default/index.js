import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Accordion,
  AccordionDetails,
  Box,
  Card,
  CardHeader,
  Divider as MuiDivider,
  FormControlLabel,
  Grid as MuiGrid,
  lighten,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

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
import SaveRefButton from "../../../components/graphs/SaveRefButton";
import ExportDataButton from "../../../components/graphs/ExportDataButton";
import OptionsPicker from "../../../components/pickers/OptionsPicker";
import Link from "@material-ui/core/Link";
import { Edit } from "@material-ui/icons";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "../../../components/pickers/DatePicker";
import { customSecondary } from "../../../theme/variants";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const SidebarSection = styled(MuiTypography)`
  color: ${() => customSecondary[500]};
  padding: ${(props) => props.theme.spacing(4)}px
    ${(props) => props.theme.spacing(7)}px
    ${(props) => props.theme.spacing(1)}px;
  opacity: 0.9;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  display: block;
`;

const TitleContainer = styled.span`
  width: 100%;
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  height: 100%;
  width: 100%;
`;

const MapContainer = styled.div`
  height: calc(441px);
  width: 100%;
`;

const TimeseriesContainer = styled.div`
  height: calc(600px - 146px);
  overflow-y: auto;
  width: 100%;
`;

const TimeseriesWrapper = styled.div`
  height: calc(100% - 58px);
  width: 100%;
`;

const Grid = styled(MuiGrid)(spacing);

const useStyles = makeStyles(() => ({
  propTable: {
    borderRadius: "5px",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
    "& td": {
      padding: "3px 6px",
      margin: 0,
    },
    "& tr:nth-child(even)": {
      backgroundColor: "#eee",
    },
    "& tr": {
      borderRadius: "5px",
    },
  },
  popupWrap: {
    maxHeight: 200,
    overflowY: "scroll",
  },
}));

function Default() {
  const classes = useStyles();
  const [map, setMap] = useState();
  const [currentTableLabel, setCurrentTableLabel] = useState();
  const divSaveRef = useRef(null);
  const graphSaveRef = useRef(null);
  const { user, getAccessTokenSilently } = useAuth0();
  const service = useService({ toast: false });
  const { currentUser } = useApp();
  const currentlyPaintedPointRef = useRef(null);
  const coordinatesRef = useRef(null);
  const longRef = useRef(null);
  const latRef = useRef(null);

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
    has_production: "Well Production",
    has_waterlevels: "Water Levels",
    has_wqdata: "Water Quality",
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    map.fire("closeAllPopups");
    map.setFeatureState(
      {
        source: "locations",
        id: currentlyPaintedPointRef.current,
      },
      { clicked: false }
    );
    setCurrentSelectedTimeseriesData(null);
    setCurrentSelectedPoint(null);
  };

  const handlePointInteractions = (pointFeatures) => {
    map.fire("closeAllPopups");

    map.setFeatureState(
      {
        source: "locations",
        id: currentlyPaintedPointRef.current,
      },
      { clicked: false }
    );
    currentlyPaintedPointRef.current = pointFeatures.well_ndx;
    map.setFeatureState(
      { source: "locations", id: pointFeatures.well_ndx },
      { clicked: true }
    );

    let popup = new mapboxgl.Popup({ maxWidth: "300px" });
    coordinatesRef.current.style.display = "block";
    longRef.current.innerHTML = pointFeatures.location_geometry.coordinates[0];
    latRef.current.innerHTML = pointFeatures.location_geometry.coordinates[1];

    // Copy coordinates array.
    const coordinates = pointFeatures.location_geometry.coordinates.slice();
    const html =
      '<div class="' +
      classes.popupWrap +
      '"><h3>Properties</h3><table class="' +
      classes.propTable +
      '"><tbody>' +
      `<tr><td><strong>Edit Well</strong></td><td><a href="/models/dm-wells/${pointFeatures.id}">Link</a></td></tr>` +
      Object.entries(pointFeatures)
        .map(([k, v]) => {
          return `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`;
        })
        .join("") +
      "</tbody></table></div>";

    popup.setLngLat(coordinates).setHTML(html).addTo(map);

    map.on("closeAllPopups", () => {
      popup.remove();
    });

    map.flyTo({
      center: [pointFeatures.longitude_dd, pointFeatures.latitude_dd],
      zoom: 14,
      padding: { bottom: 250 },
    });
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

        graphData =
          parameterFilteredData.length === 0
            ? []
            : {
                labels: parameterFilteredData.map(
                  (item) => new Date(item.test_date)
                ),
                units: parameterFilteredData[0].unit_desc,
                parameter: parameterFilteredData[0].wq_parameter_name,
                datasets: [
                  {
                    label: parameterFilteredData[0].cuwcd_well_number,
                    backgroundColor: lighten(lineColors.blue, 0.5),
                    borderColor: lineColors.blue,
                    data: parameterFilteredData.map(
                      (item) => item.result_value
                    ),
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

  const statusChipColors = {
    Active: lineColors.blue,
    Inactive: lineColors.gray,
    Abandoned: lineColors.gray,
    "Never Drilled": lineColors.orange,
    Capped: lineColors.red,
    Plugged: lineColors.red,
    Proposed: lineColors.green,
    Unknown: lineColors.olive,
  };

  const tableColumns = [
    {
      title: "CUWCD Well Number",
      field: "cuwcd_well_number",
    },
    { title: "State Well Number", field: "state_well_number" },
    { title: "Well Name", field: "well_name" },
    { title: "Source Aquifer", field: "source_aquifer" },
    { title: "Well Depth (ft)", field: "well_depth_ft" },
    { title: "Primary Well Use", field: "primary_use" },
    { title: "Current Owner", field: "well_owner" },
    {
      title: "Well Status",
      field: "well_status",
      render: (rowData) => {
        return renderStatusChip(rowData.well_status, statusChipColors);
      },
    },
  ];

  useEffect(() => {
    if (currentSelectedPoint) {
      setCurrentTableLabel(
        filteredData.filter(
          (item) => item.cuwcd_well_number === currentSelectedPoint
        )[0]
      );
    }
  }, [currentSelectedPoint, filteredData]);

  const waterQualityReport = {
    2: "E. coli?",
    1: "A family of bacteria common in soils, plants and animals. The presence/absence test only indicates if coliform bacteria are present. No distinction is made on the origin of the coliform bacteria. A positive result warrants further analysis, an inspection of the well integrity and well/water system disinfection. Coliform bacteria should not be present under the federal drinking water standard. Coliform Bacteria - A family of bacteria common in soils, plants and animals. The presence/absence test only indicates if coliform bacteria are present. No distinction is made on the origin of the coliform bacteria. A positive result warrants further analysis, an inspection of the well integrity and well/water system disinfection. Coliform bacteria should not be present under the federal drinking water standard.",
    6: "The pH of water is a measure of the concentration of hydrogen ions. pH is expressed on a scale from 1 to 14, with 1 being most acidic, 7 neutral and 14 being the most basic or alkaline. The pH of drinking water should be between 6.5 and 8.5 to meet the federal secondary drinking water standard.",
    3: "Conductivity measures the ability of water to conduct an electric current and is useful to quickly assess water quality. Conductivity increases with the number of dissolved ions in the water but is affected by temperature and the specific ions in solution. High conductivity or large changes may warrant further analysis. There is no EPA or TCEQ drinking water standard for conductivity.",
    4: "Total Dissolved Solids refers to dissolved minerals (ions) and is a good general indicator of water quality. The value reported for this parameter is calculated by the conductivity meter as a function of the conductivity value and may not account for all the factors affecting the Conductivity-TDS relationship. TDS values reported by CUWCD should be considered as “apparent”. The accuracy may range approximately +/- 25 percent from values reported by certified laboratories. The TCEQ secondary drinking water standard for TDS is 1000 mg/L. Water is considered fresh if TDS is 1000 mg/L or less.",
    5: "Salinity?",
    7: "Alkalinity does not refer to pH, but instead refers to the ability of water to resist change in pH and may be due to dissolved bicarbonates. Low water alkalinity may cause corrosion; high alkalinity may cause scale formation. There is no EPA or TCEQ drinking water standard for alkalinity.",
    8: '“Hard" water may be indicated by large amounts of soap required to form suds and scale deposits in pipes and water heaters. Hardness is caused by calcium, magnesium, manganese or iron in the form of bicarbonates, carbonates, sulfates or chlorides.',
    9: "Nitrate/Nitrite - Nitrate and Nitrite are of special concern to infants and can cause “blue baby” syndrome. The federal drinking water standard for nitrate is 10 mg/L. The federal drinking water standard for nitrite is 1 mg/L. Nitrate or nitrite may indicate an impact from sewage, fertilizer or animal waste.",
    10: "Nitrate/Nitrite - Nitrate and Nitrite are of special concern to infants and can cause “blue baby” syndrome. The federal drinking water standard for nitrate is 10 mg/L. The federal drinking water standard for nitrite is 1 mg/L. Nitrate or nitrite may indicate an impact from sewage, fertilizer or animal waste.",
    11: "Phosphates may indicate impact from laundering agents. Testing for phosphates provides a general indicator of water quality. There is no EPA or TCEQ drinking water standard for phosphate.",
    12: "Sulfate compounds are many of the dissolved salts found in groundwater. Sulfate can produce laxative effects, bad taste or smell. The TCEQ secondary drinking water standard for sulfate is 300 mg/L.",
    13: "Fluoride may occur naturally and is sometimes added to drinking water to promote strong teeth. Fluoride may stain children’s teeth. The federal drinking water standard for fluoride is 4.0 mg/L. Water Quality Assessment What are the parameters being assessed?",
  };

  const formatTableTitle = (location, graphType) => {
    if (!location) return null;
    if (graphType === "Well Production") {
      return (
        <>
          <Typography variant="h4" pl={2} style={{ lineHeight: 1.3 }}>
            <strong>Reported Well Production for Well: </strong>
            {location.well_name ?? "NA"} {location.cuwcd_well_number ?? "NA"}
            <Box>
              <strong>Aquifer: </strong>
              {location.source_aquifer ?? "NA"}
            </Box>
            {location.state_well_number && (
              <Box>
                <strong>State Well Number: </strong>
                {location.state_well_number}
              </Box>
            )}
          </Typography>
          <br />
          <Typography variant="subtitle1" pl={2} style={{ lineHeight: 1.3 }}>
            <Box>
              <strong>Owner: </strong>
              {location.well_owner ?? "NA"}
            </Box>
            <Box>
              <strong>Permit Info: </strong>
              {location.permit_number ?? "NA"}
            </Box>
            <Box>
              <strong>Aggregated System: </strong>
              {location.agg_system_name ?? "NA"}
            </Box>
          </Typography>
        </>
      );
    } else if (graphType === "Water Levels") {
      return (
        <>
          <Typography variant="h4" pl={2} style={{ lineHeight: 1.3 }}>
            <strong>Reported Water Levels for Well: </strong>
            {location.well_name ?? "NA"} {location.cuwcd_well_number ?? "NA"}
            <Box>
              <strong>Aquifer: </strong>
              {location.source_aquifer ?? "NA"}
            </Box>
            {location.state_well_number && (
              <Box>
                <strong>State Well Number: </strong>
                {location.state_well_number}
              </Box>
            )}
          </Typography>
          <br />
          <Typography variant="subtitle1" pl={2} style={{ lineHeight: 1.3 }}>
            <Box component="span" mr={6}>
              <strong>Well Depth: </strong>
              {location.well_depth_ft ? `${location.well_depth_ft} ft` : "NA"}
            </Box>
            <Box component="span" mr={6}>
              <strong>Top of Screen: </strong>
              {location.screen_top_depth_ft
                ? `${location.screen_top_depth_ft} ft`
                : "NA"}
            </Box>
            <Box component="span" mr={6}>
              <strong>Bottom of Screen: </strong>
              {location.screen_bottom_depth_ft
                ? `${location.screen_bottom_depth_ft} ft`
                : "NA"}
            </Box>
          </Typography>
        </>
      );
    } else if (graphType === "Water Quality") {
      return (
        <>
          <Typography variant="h4" pl={2} style={{ lineHeight: 1.3 }}>
            <strong>
              Reported{" "}
              {
                wQparameterOptions.filter(
                  (item) => item.value === selectedWQParameter
                )[0].label
              }{" "}
              Measurements for Well:{" "}
            </strong>
            {location.well_name ?? "NA"} {location.cuwcd_well_number ?? "NA"}
            <Box>
              <strong>Aquifer: </strong>
              {location.source_aquifer ?? "NA"}
            </Box>
            {location.state_well_number && (
              <Box>
                <strong>State Well Number: </strong>
                {location.state_well_number}
              </Box>
            )}
          </Typography>
          <br />
          <Typography variant="subtitle1" pl={2} style={{ lineHeight: 1.3 }}>
            <Box>
              About{" "}
              {
                wQparameterOptions.filter(
                  (item) => item.value === selectedWQParameter
                )[0].label
              }
              :{" "}
            </Box>

            <Box>{waterQualityReport[selectedWQParameter]}</Box>
          </Typography>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Dashboard" />
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Welcome back, {user?.name}!
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} sm={7} md={8} lg={9}>
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
                  currentlyPaintedPointRef={currentlyPaintedPointRef}
                  coordinatesRef={coordinatesRef}
                  longRef={longRef}
                  latRef={latRef}
                />
              </MapContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} sm={5} md={4} lg={3}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="map"
              id="map"
            >
              <Typography variant="h4" ml={2}>
                Filters
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ display: "block" }}>
              <List disablePadding>
                <RadioGroup
                  aria-label="data"
                  name="data"
                  value={radioValue}
                  onChange={handleRadioChange}
                >
                  <SidebarSection>Data Selection</SidebarSection>
                  <Grid container>
                    <Grid item xs={6} sm={12}>
                      <ListItem>
                        <FormControlLabel
                          value="all"
                          control={<Radio />}
                          label={radioLabels["all"]}
                        />
                      </ListItem>
                    </Grid>
                    <Grid item xs={6} sm={12}>
                      <ListItem>
                        <FormControlLabel
                          value="has_production"
                          control={<Radio />}
                          label={radioLabels["has_production"]}
                        />
                      </ListItem>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6} sm={12}>
                      <ListItem>
                        <FormControlLabel
                          value="has_waterlevels"
                          control={<Radio />}
                          label={radioLabels["has_waterlevels"]}
                        />
                      </ListItem>
                    </Grid>
                    <Grid item xs={6} sm={12}>
                      <ListItem>
                        <FormControlLabel
                          value="has_wqdata"
                          control={<Radio />}
                          label={radioLabels["has_wqdata"]}
                        />
                      </ListItem>
                    </Grid>
                  </Grid>
                </RadioGroup>
                <SidebarSection>Date Range</SidebarSection>
                <ListItem>
                  <DatePicker
                    label="Start Date"
                    name="startDate"
                    selectedDate={filterValues.startDate}
                    setSelectedDate={changeFilterValues}
                    checked={filterValues.checked}
                  />
                </ListItem>
                <ListItem>
                  <DatePicker
                    label="End Date"
                    name="endDate"
                    selectedDate={filterValues.endDate}
                    setSelectedDate={changeFilterValues}
                    checked={filterValues.checked}
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {Boolean(filteredMutatedGraphData) ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div ref={divSaveRef}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon data-html2canvas-ignore="true" />}
                  aria-controls="time-series"
                  id="time-series"
                >
                  <TitleContainer>
                    {formatTableTitle(
                      currentTableLabel,
                      radioLabels[radioValue]
                    )}
                  </TitleContainer>
                </AccordionSummary>
                <Panel>
                  <AccordionDetails>
                    <TimeseriesContainer>
                      <span data-html2canvas-ignore="true">
                        <Grid container pb={2}>
                          <Grid
                            item
                            style={{
                              flexGrow: 1,
                              maxWidth: "calc(100% - 110px)",
                            }}
                          >
                            {radioValue === "has_wqdata" && wQparameterOptions && (
                              <>
                                <SidebarSection>Parameters</SidebarSection>

                                <OptionsPicker
                                  selectedOption={selectedWQParameter}
                                  setSelectedOption={setSelectedWQParameter}
                                  options={wQparameterOptions}
                                  label="Water Quality Parameters"
                                />
                              </>
                            )}
                          </Grid>
                          <Grid
                            item
                            style={{ display: "flex" }}
                            alignItems="flex-end"
                            mb={1}
                          >
                            <ExportDataButton
                              title="cuwcd_well_number"
                              data={currentSelectedTimeseriesData}
                              filterValues={filterValues}
                              parameter={selectedWQParameter}
                            />
                            <SaveRefButton
                              data-html2canvas-ignore
                              ref={divSaveRef}
                              title={currentSelectedPoint}
                            />
                          </Grid>
                        </Grid>
                      </span>
                      <TimeseriesWrapper
                        style={
                          radioValue === "has_wqdata"
                            ? { height: "calc(100% - 100px)" }
                            : null
                        }
                      >
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
                          ref={graphSaveRef}
                          filterValues={filterValues}
                          type={
                            radioValue === "has_production" ? "bar" : "scatter"
                          }
                        />
                      </TimeseriesWrapper>
                    </TimeseriesContainer>
                  </AccordionDetails>
                </Panel>
              </Accordion>
            </div>
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
              {radioValue === "has_wqdata" && wQparameterOptions && (
                <Box mr={2} ml={2}>
                  <SidebarSection>Parameters</SidebarSection>
                  <ListItem>
                    <OptionsPicker
                      selectedOption={selectedWQParameter}
                      setSelectedOption={setSelectedWQParameter}
                      options={wQparameterOptions}
                      label="Water Quality Parameters"
                    />
                  </ListItem>
                </Box>
              )}
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
                    label="Search Well Table"
                    columns={tableColumns}
                    data={filteredData}
                    height="350px"
                    actions={[
                      (rowData) => ({
                        icon: "bar_chart",
                        tooltip: "Production",
                        disabled: !rowData.has_production,
                        onClick: (event, rowData) => {
                          setRadioValue("has_production");
                          setCurrentSelectedPoint(rowData.cuwcd_well_number);
                          setCurrentSelectedTimeseriesData(null);
                          handlePointInteractions(rowData);
                        },
                      }),
                      (rowData) => ({
                        icon: "water",
                        tooltip: "Water Levels",
                        disabled: !rowData.has_waterlevels,
                        onClick: (event, rowData) => {
                          setRadioValue("has_waterlevels");
                          setCurrentSelectedPoint(rowData.cuwcd_well_number);
                          setCurrentSelectedTimeseriesData(null);
                          handlePointInteractions(rowData);
                        },
                      }),
                      (rowData) => ({
                        icon: "bloodtype",
                        tooltip: "Water Quality",
                        disabled: !rowData.has_wqdata,
                        onClick: (event, rowData) => {
                          setRadioValue("has_wqdata");
                          setCurrentSelectedPoint(rowData.cuwcd_well_number);
                          setCurrentSelectedTimeseriesData(null);
                          handlePointInteractions(rowData);
                        },
                      }),
                      (rowData) => ({
                        icon: () => {
                          return (
                            <Link
                              component={NavLink}
                              exact
                              to={"/models/dm-wells/" + rowData.id}
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
                          handlePointInteractions(rowData);
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
