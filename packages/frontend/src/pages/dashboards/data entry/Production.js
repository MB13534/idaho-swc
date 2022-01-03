import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Accordion,
  AccordionDetails,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Card,
  CardHeader,
  Divider as MuiDivider,
  FormControlLabel,
  Grid as MuiGrid,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { useAuth0 } from "@auth0/auth0-react";
import Panel from "../../../components/panels/Panel";
import ProductionMap from "../../../components/map/ProductionMap";
import { useQuery } from "react-query";
import { findRawRecords } from "../../../services/crudService";
import useService from "../../../hooks/useService";
import { useApp } from "../../../AppProvider";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "../../../components/Table";
import DataAdminTable from "../../../components/DataAdminTable";
import axios from "axios";
import TimeseriesLineChart from "../../../components/graphs/TimeseriesLineChart";
import {
  formatBooleanTrueFalse,
  lineColors,
  renderStatusChip,
  firstOfYear,
  lastOfYear,
  filterDataForWellOwner,
  oneYearAgo,
} from "../../../utils";
import SaveRefButton from "../../../components/graphs/SaveRefButton";
import ExportDataButton from "../../../components/graphs/ExportDataButton";
import Link from "@material-ui/core/Link";
import { Edit } from "@material-ui/icons";
import mapboxgl from "mapbox-gl";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "../../../components/pickers/DatePicker";
import { customSecondary } from "../../../theme/variants";
import Button from "@material-ui/core/Button";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Typography = styled(MuiTypography)(spacing);

const SidebarSection = styled(MuiTypography)`
  ${spacing}
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
  height: calc(458px);
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

function Production() {
  const classes = useStyles();
  const [map, setMap] = useState();
  const [currentTableLabel, setCurrentTableLabel] = useState();
  const divSaveRef = useRef(null);
  const graphSaveRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();
  const service = useService({ toast: false });
  const { currentUser } = useApp();
  const currentlyPaintedPointRef = useRef(null);
  const coordinatesRef = useRef(null);
  const longRef = useRef(null);
  const latRef = useRef(null);

  //date filter defaults
  const defaultFilterValues = {
    // startDate: lastOfJanuary,
    startDate: oneYearAgo,
    endDate: null,
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
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    map.fire("closeAllPopups");
    if (map.getLayer("locations")) {
      map.setFeatureState(
        {
          source: "locations",
          id: currentlyPaintedPointRef.current,
        },
        { clicked: false }
      );
    }

    setCurrentSelectedTimeseriesData(null);
    setCurrentSelectedEditTableData(null);
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

    map.on("closeAllPopups", () => {
      popup.remove();
    });

    map.flyTo({
      center: [pointFeatures.longitude_dd, pointFeatures.latitude_dd],
      zoom: 14,
      padding: { bottom: 250 },
    });
    const titleLookup = {
      cuwcd_well_number: "CUWCD Well #",
      exempt: "Exempt?",
      well_name: "Well Name",
      state_well_number: "State Well #",
      well_status: "Well Status",
      source_aquifer: "Source Aquifer",
      well_depth_ft: "Well Depth (ft)",
      elevation_ftabmsl: "Elevation (ft msl)",
      screen_top_depth_ft: "Screen Top Depth (ft)",
      screen_bottom_depth_ft: "Screen Bottom Depth (ft)",
      primary_use: "Primary Use",
      secondary_use: "Secondary Use",
      agg_system_name: "Aggregation System",
      permit_number: "Permit #",
      well_owner: "Well Owner",
      well_owner_address: "Well Owner Address",
      well_owner_phone: "Well Owner Phone",
      well_owner_email: "Well Owner Email",
      well_contact: "Well Contact",
      well_contact_address: "Well Contact Address",
      well_contact_phone: "Well Contact Phone",
      well_contact_email: "Well Contact Email",
      driller: "Driller",
      date_drilled: "Date Drilled",
      drillers_log: "Drillers Log?",
      general_notes: "General Notes",
      well_remarks: "Well Remarks",
      count_production: "Count of Production Entries",
      count_waterlevels: "Count of Water Levels Entries",
      count_wqdata: "Count of WQ Data Entries",
      longitude_dd: "Longitude (dd)",
      latitude_dd: "Latitude (dd)",
      registration_notes: "Registration Notes",
      registration_date: "Registration Date",
      editor_name: "Editor",
      last_edited_date: "Last Edited Date",
      list_of_attachments: "List of Attachments",
      authorized_users: "Authorized Users",
    };

    const canUserEdit = currentUser.isUser
      ? ""
      : `<tr><td><strong>Edit Well</strong></td><td><a href="/models/dm-wells/${pointFeatures.id}">Link</a></td></tr>`;

    const html =
      '<div class="' +
      classes.popupWrap +
      '"><h3>Properties</h3><table class="' +
      classes.propTable +
      '"><tbody>' +
      canUserEdit +
      Object.entries(pointFeatures)
        .map(([k, v]) => {
          if (
            [
              "id",
              "has_production",
              "has_waterlevels",
              "has_wqdata",
              "well_ndx",
              "location_geometry",
              "tableData",
              "is_permitted",
              "is_exempt",
              "is_monitoring",
              "well_type",
              "authorized_users",
            ].includes(k)
          )
            return null;
          if (v === null) return null;
          return `<tr><td><strong>${
            titleLookup[k]
          }</strong></td><td>${formatBooleanTrueFalse(v)}</td></tr>`;
        })
        .join("") +
      "</tbody></table></div>";

    popup.setLngLat(coordinates).setHTML(html).addTo(map);
  };

  const [filteredData, setFilteredData] = React.useState([]);
  const { data, isLoading, error } = useQuery(
    ["UiListWells", currentUser],
    async () => {
      if (!currentUser) return;
      try {
        const response = await service([findRawRecords, ["UiListWells"]]);
        let userData = [...response];
        if (currentUser.isUser) {
          userData = filterDataForWellOwner(userData, currentUser);
        }
        //filters out any well that does not have geometry data
        const filterData = userData.filter(
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

  const cuwcdLookup = useMemo(() => {
    let converted = {};
    if (data?.length > 0) {
      data.forEach((item) => {
        converted[item.well_ndx] = item.cuwcd_well_number;
      });
    }
    return converted;
  }, [data]);

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
  const [currentSelectedEditTableData, setCurrentSelectedEditTableData] =
    useState(null);

  useEffect(() => {
    if (currentSelectedPoint) {
      async function send() {
        try {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };

          const { data: graphResults } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/graph-wellproductions/${currentSelectedPoint}`,
            {
              cuwcd_well_number: currentSelectedPoint,
            },
            { headers }
          );

          if (graphResults.length) {
            setCurrentSelectedTimeseriesData(graphResults);
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
  }, [currentSelectedPoint, currentSelectedEditTableData]); // eslint-disable-line

  const [unfilteredEditTableResults, setunfilteredEditTableResults] =
    useState(null);
  useEffect(() => {
    if (currentSelectedPoint) {
      async function send() {
        try {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };

          const { data: editTableResults } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/dm-well-productions/${currentSelectedPoint}`,
            {
              cuwcd_well_number: currentSelectedPoint,
            },
            { headers }
          );

          setunfilteredEditTableResults(editTableResults);

          if (editTableResults?.length > 0) {
            const dateFilteredEditTableResults = editTableResults.filter(
              (item) =>
                new Date(item.report_year, item.report_month) >=
                  filterValues.startDate &&
                new Date(item.report_year, item.report_month - 1) <=
                  (filterValues.endDate || new Date(3000, 0, 1))
            );
            setCurrentSelectedEditTableData(dateFilteredEditTableResults);
          } else {
            setCurrentSelectedEditTableData(null);
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

  useEffect(() => {
    if (currentSelectedPoint) {
      const dateFilteredEditTableResults = unfilteredEditTableResults.filter(
        (item) =>
          new Date(item.report_year, item.report_month) >=
            filterValues.startDate &&
          new Date(item.report_year, item.report_month - 1) <=
            (filterValues.endDate || new Date(3000, 0, 1))
      );
      setCurrentSelectedEditTableData(dateFilteredEditTableResults);
    }
  }, [filterValues]); // eslint-disable-line

  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState({});
  useEffect(() => {
    if (currentSelectedTimeseriesData?.length) {
      //mutate data for chartJS to use
      let graphData;
      if (radioValue === "has_production") {
        graphData = {
          labels: currentSelectedTimeseriesData.map(
            (item) => new Date(item.report_date)
          ),
          datasets: [
            {
              label: "Annual Allocation (g)",
              type: "line",
              yAxisID: "yR",
              pointStyle: "line",
              backgroundColor: lineColors.darkGray,
              borderColor: lineColors.darkGray,
              data: currentSelectedTimeseriesData.map(
                (item) => item.allocation_gallons
              ),
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 4,
              spanGaps: true,
              hidden: false,
            },
            {
              label: "Annual Allocation (af)",
              type: "line",
              yAxisID: "yR",
              pointStyle: "line",
              backgroundColor: lineColors.darkGray,
              borderColor: lineColors.darkGray,
              data: currentSelectedTimeseriesData.map(
                (item) => item.allocation_af
              ),
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 4,
              spanGaps: true,
              hidden: true,
            },
            {
              label: "Cumulative Pumping (g)",
              type: "line",
              yAxisID: "yR",
              pointStyle: "rect",
              stepped: "middle",
              backgroundColor: "rgba(141, 144, 147, .5)",
              borderColor: lineColors.gray,
              data: currentSelectedTimeseriesData.map(
                (item) => item.cum_production_gallons
              ),
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 2,
              spanGaps: true,
              hidden: false,
            },
            {
              label: "Cumulative Pumping (af)",
              type: "line",
              yAxisID: "yR",
              pointStyle: "rect",
              stepped: "middle",
              backgroundColor: "rgba(141, 144, 147, .5)",
              borderColor: lineColors.gray,
              data: currentSelectedTimeseriesData.map(
                (item) => item.cum_production_af
              ),
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 2,
              spanGaps: true,
              hidden: true,
            },
            {
              label: "Operational Permit Pumping (g)",
              type: "bar",
              yAxisID: "yL",
              pointStyle: "rect",
              backgroundColor: "rgba(67, 99, 215, .7)",
              borderColor: lineColors.blue,
              data: currentSelectedTimeseriesData.map(
                (item) => item.o_pumping_gallons
              ),
              borderWidth: 2,
              spanGaps: true,
              hidden: false,
              barPercentage: 0.2,
            },
            {
              label: "Operational Permit Pumping (af)",
              type: "bar",
              yAxisID: "yL",
              pointStyle: "rect",
              backgroundColor: "rgba(67, 99, 215, .7)",
              borderColor: lineColors.blue,
              data: currentSelectedTimeseriesData.map(
                (item) => item.o_pumping_af
              ),
              borderWidth: 2,
              spanGaps: true,
              hidden: true,
              barPercentage: 0.2,
            },
            {
              label: "Historical Pumping (g)",
              type: "bar",
              yAxisID: "yL",
              pointStyle: "rect",
              backgroundColor: "rgba(245, 130, 49, .7)",
              borderColor: lineColors.orange,
              data: currentSelectedTimeseriesData.map(
                (item) => item.h_pumping_gallons
              ),
              borderWidth: 2,
              spanGaps: true,
              hidden: false,
              barPercentage: 0.2,
            },
            {
              label: "Historical Pumping (af)",
              type: "bar",
              yAxisID: "yL",
              pointStyle: "rect",
              backgroundColor: "rgba(245, 130, 49, .7)",
              borderColor: lineColors.orange,
              data: currentSelectedTimeseriesData.map(
                (item) => item.h_pumping_af
              ),
              borderWidth: 2,
              spanGaps: true,
              hidden: true,
              barPercentage: 0.2,
            },
          ],
        };
      }

      setFilteredMutatedGraphData(graphData);
    } else {
      setFilteredMutatedGraphData(null);
    }
  }, [currentSelectedTimeseriesData]); // eslint-disable-line

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

  const searchTableColumns = [
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

  const monthsLookup = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const editTableColumns = [
    {
      title: "CUWCD Well Number",
      field: "well_ndx",
      lookup: cuwcdLookup,
      editable: "never",
      initialEditValue: currentlyPaintedPointRef.current,
    },
    {
      title: "Report Month",
      field: "report_month",
      lookup: monthsLookup,
      initialEditValue:
        new Date().getMonth() === 0 ? 12 : new Date().getMonth(),
    },
    {
      title: "Report Year",
      field: "report_year",
      initialEditValue: new Date().getFullYear(),
      type: "numeric",
      defaultSort: "desc",
      validate: (rowData) =>
        rowData.report_year < 2010
          ? { isValid: false, helperText: "The report year must be after 2010" }
          : isNaN(rowData.report_year)
          ? {
              isValid: false,
              helperText: "A report year is required",
            }
          : true,
    },
    {
      title: "Production Gallons",
      field: "production_gallons",
      type: "numeric",
      initialEditValue: 0,
      validate: (rowData) =>
        isNaN(rowData.production_gallons)
          ? {
              isValid: false,
              helperText: "A production value is required",
            }
          : rowData.production_gallons < 0
          ? {
              isValid: false,
              helperText: "The production value cannot be negative",
            }
          : true,
    },
    {
      title: "Production Notes",
      field: "production_notes",
      editComponent: (props) => (
        <Input
          defaultValue={props.value ?? ""}
          onChange={(e) => props.onChange(e.target.value)}
          type="text"
        />
      ),
      // editComponent: (rowData) => rowData.production_notes ?? "",
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
    } else {
      return null;
    }
  };

  const [productionUnitsLabels, setProductionUnitsLabels] = useState({
    yLLabel: "Monthly Well Production, Gallons",
    yRLabel: "Annual Production and Allocations, Gallons",
  });
  const changeProductionUnitsLabels = (name, value) => {
    setProductionUnitsLabels((prevState) => {
      let newLabelsValues = { ...prevState };
      newLabelsValues[name] = value;
      return newLabelsValues;
    });
  };

  const [isGraphRefCurrent, setIsGraphRefCurrent] = useState(false);

  const handleToggleProductionUnitsChange = () => {
    for (let x = 0; x < filteredMutatedGraphData.datasets.length; x++) {
      graphSaveRef.current.setDatasetVisibility(
        x,
        !graphSaveRef.current.isDatasetVisible(x)
      );
    }

    graphSaveRef.current.config._config.options.scales.yL.title.text =
      productionUnitsLabels.yLLabel === "Monthly Well Production, Gallons"
        ? "Monthly Well Production, Acre-Feet"
        : "Monthly Well Production, Gallons";

    graphSaveRef.current.config._config.options.scales.yR.title.text =
      productionUnitsLabels.yRLabel ===
      "Annual Production and Allocations, Gallons"
        ? "Annual Production and Allocations, Acre-Feet"
        : "Annual Production and Allocations, Gallons";

    changeProductionUnitsLabels(
      "yLLabel",
      productionUnitsLabels.yLLabel === "Monthly Well Production, Gallons"
        ? "Monthly Well Production, Acre-Feet"
        : "Monthly Well Production, Gallons"
    );

    changeProductionUnitsLabels(
      "yRLabel",
      productionUnitsLabels.yRLabel ===
        "Annual Production and Allocations, Gallons"
        ? "Annual Production and Allocations, Acre-Feet"
        : "Annual Production and Allocations, Gallons"
    );

    graphSaveRef.current.update();
  };

  return (
    <React.Fragment>
      <Helmet title="Well Production" />
      <Typography variant="h3" gutterBottom display="inline">
        Well Production Data
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Well Production</Typography>
      </Breadcrumbs>

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
                <ProductionMap
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
                  setRadioValue={setRadioValue}
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
                <SidebarSection>Quick Set</SidebarSection>
                <Grid container>
                  <Grid item xs={6} sm={12}>
                    <ListItem>
                      <Button
                        size="small"
                        style={{ width: "100%" }}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          changeFilterValues("startDate", null);
                          changeFilterValues("endDate", null);
                        }}
                      >
                        Period of Record
                      </Button>
                    </ListItem>
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <ListItem
                      style={{
                        alignItems: "stretch",
                        height: "100%",
                      }}
                    >
                      <Button
                        size="small"
                        style={{ width: "100%" }}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          changeFilterValues("startDate", firstOfYear);
                          changeFilterValues("endDate", lastOfYear);
                        }}
                      >
                        Current Year
                      </Button>
                    </ListItem>
                  </Grid>
                </Grid>
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {Boolean(currentSelectedEditTableData) ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="table-content"
                id="table-header"
              >
                <Typography variant="h4" ml={2}>
                  Well Production Data
                </Typography>
              </AccordionSummary>
              <Panel>
                <AccordionDetails>
                  <TableWrapper>
                    <DataAdminTable
                      pageSize={10}
                      // isLoading={isLoading}
                      label="Search Well Table"
                      columns={editTableColumns}
                      data={currentSelectedEditTableData}
                      height="350px"
                      updateHandler={setCurrentSelectedEditTableData}
                      endpoint="dm-well-productions"
                      ndxField="ndx"
                    />
                  </TableWrapper>
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
                    ? "Filter Data and Click a Point on the Map to View Corresponding Well Production Data"
                    : `Select a Point on the Map to View Corresponding Well Production Data`
                }
              />
            </Card>
          </Grid>
        </Grid>
      )}

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
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            {radioValue === "has_production" &&
                              isGraphRefCurrent && (
                                <>
                                  <Button
                                    size="small"
                                    style={{ width: "130px" }}
                                    variant="contained"
                                    color="primary"
                                    onClick={handleToggleProductionUnitsChange}
                                  >
                                    Switch Units
                                  </Button>
                                </>
                              )}
                          </Grid>
                          <Grid
                            item
                            style={{ display: "flex", alignItems: "flex-end" }}
                            mb={1}
                          >
                            <ExportDataButton
                              title="cuwcd_well_number"
                              data={currentSelectedTimeseriesData}
                              filterValues={filterValues}
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
                          radioValue === "has_production"
                            ? { height: "calc(100% - 58px)" }
                            : null
                        }
                      >
                        <TimeseriesLineChart
                          data={filteredMutatedGraphData}
                          error={error}
                          isLoading={isLoading}
                          yLLabel={productionUnitsLabels.yLLabel}
                          yRLLabel={productionUnitsLabels.yRLabel}
                          reverseLegend={false}
                          ref={graphSaveRef}
                          filterValues={filterValues}
                          type="bar"
                          displayLegend={true}
                          setIsGraphRefCurrent={setIsGraphRefCurrent}
                          stacked={true}
                          xLabelUnit="month"
                          maxTicksX={12}
                          maxTicksYL={6}
                          maxTicksYR={5}
                          align="start"
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
                    columns={searchTableColumns}
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
                          setCurrentSelectedEditTableData(null);
                          handlePointInteractions(rowData);
                        },
                      }),
                      (rowData) =>
                        !currentUser.isUser && {
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
                        },
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

export default Production;
