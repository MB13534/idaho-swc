import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { ThemeProvider } from "styled-components/macro";
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
import { useQuery } from "react-query";
import { findRawRecords } from "../../../services/crudService";
import { onPointClickSetCoordinateRefs } from "../../../utils/map";
import { jssPreset, StylesProvider } from "@material-ui/core/styles";
import useService from "../../../hooks/useService";
import { useApp } from "../../../AppProvider";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "../../../components/Table";
import DataAdminTable from "../../../components/DataAdminTable";
import axios from "axios";
import TimeseriesLineChart from "../../../components/graphs/TimeseriesLineChart";
import {
  lineColors,
  renderStatusChip,
  firstOfYear,
  lastOfYear,
  filterDataForWellOwner,
  dateFormatter,
} from "../../../utils";
import SaveRefButton from "../../../components/graphs/SaveRefButton";
import ExportDataButton from "../../../components/graphs/ExportDataButton";
import Link from "@material-ui/core/Link";
import { Edit } from "@material-ui/icons";
import mapboxgl from "mapbox-gl";
import DatePicker from "../../../components/pickers/DatePicker";
import { customSecondary } from "../../../theme/variants";
import Button from "@material-ui/core/Button";
import DashboardMap from "../../../components/map/DashboardMap";
import ReactDOM from "react-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";
import createTheme from "../../../theme";
import MainPopup from "../../../components/map/components/MainPopup";
import { create } from "jss";
import { useSelector } from "react-redux";
import OptionsPicker from "../../../components/pickers/OptionsPicker";
import NumberFormat from "react-number-format";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

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

function WaterQuality() {
  const theme = useSelector((state) => state.themeReducer);
  const { getAccessTokenSilently } = useAuth0();
  const service = useService({ toast: false });
  const { currentUser, lookupTableCache } = useApp();

  const [map, setMap] = useState();
  const [currentTableLabel, setCurrentTableLabel] = useState();

  const divSaveRef = useRef(null);
  const graphSaveRef = useRef(null);
  const currentlyPaintedPointRef = useRef(null);
  const coordinatesContainerRef = useRef(null);
  const popUpRef = useRef(
    new mapboxgl.Popup({ maxWidth: "310px", focusAfterOpen: false })
  );
  const longRef = useRef(null);
  const latRef = useRef(null);
  const eleRef = useRef(null);

  //date filter defaults
  const defaultFilterValues = {
    // startDate: lastOfJanuary,
    // startDate: oneYearAgo,
    startDate: null,
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
    has_wqdata: "Water Quality",
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

    const coordinates = pointFeatures.location_geometry.coordinates;

    map.flyTo({
      center: coordinates,
      zoom: 14,
      padding: { bottom: 250 },
    });

    //uncolor previously painted/selected point
    map.setFeatureState(
      {
        source: "locations",
        id: currentlyPaintedPointRef.current,
      },
      { clicked: false }
    );

    //set the id to color the point yellow
    currentlyPaintedPointRef.current = pointFeatures.well_ndx;
    map.setFeatureState(
      { source: "locations", id: pointFeatures.well_ndx },
      { clicked: true }
    );

    //sets ref.current.innerHTMLs for coordinates popup
    coordinatesContainerRef.current.style.display = "block";
    onPointClickSetCoordinateRefs(
      coordinatesContainerRef,
      longRef,
      latRef,
      eleRef,
      pointFeatures.latitude_dd,
      pointFeatures.longitude_dd
    );

    //handles main point click popup
    const excludedPopupFields = [
      "id",
      "has_production",
      "has_waterlevels",
      "has_wqdata",
      "well_ndx",
      "location_geometry",
      "authorized_users",
      "is_well_owner",
      "tableData",
      "is_permitted",
      "is_exempt",
      "is_monitoring",
      "well_type",
      "tableData",
    ];

    const popupNode = document.createElement("div");
    ReactDOM.render(
      //MJB adding style providers to the popup
      <StylesProvider jss={jss}>
        <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
          <ThemeProvider theme={createTheme(theme.currentTheme)}>
            <MainPopup
              excludeFields={excludedPopupFields}
              feature={pointFeatures}
              currentUser={currentUser}
            />
          </ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>,
      popupNode
    );

    popUpRef.current.setLngLat(coordinates).setDOMContent(popupNode).addTo(map);

    map.on("closeAllPopups", () => {
      popUpRef.current.remove();
    });
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

  //paramaters in picker that are selected by user
  const [selectedWQParameter, setSelectedWQParameter] = useState(6);
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

  //LOOKUPS
  const cuwcdLookup = useMemo(() => {
    let converted = {};
    if (data?.length > 0) {
      data.forEach((item) => {
        converted[item.well_ndx] = item.cuwcd_well_number;
      });
    }
    return converted;
  }, [data]);

  const listCollectedBy = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length) {
      lookupTableCache["list_collected_bys"].forEach((d) => {
        if (d.applies_to.includes("wq")) {
          converted[d.collected_by_ndx] = d.collected_by_desc;
        }
      });
    }
    return converted;
  }, [lookupTableCache]);

  const listTestedBy = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length) {
      lookupTableCache["list_tested_bys"].forEach((d) => {
        converted[d.tested_by_ndx] = d.tested_by_desc;
      });
    }
    return converted;
  }, [lookupTableCache]);

  const listWqPresenceAbsence = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length) {
      lookupTableCache["list_wq_presence_absences"].forEach((d) => {
        converted[d.pa_ndx] = d.pa_desc;
      });
    }
    return converted;
  }, [lookupTableCache]);

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
            `${process.env.REACT_APP_ENDPOINT}/api/graph-waterquality/${currentSelectedPoint}`,
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
            `${process.env.REACT_APP_ENDPOINT}/api/dm-wqs/${currentSelectedPoint}`,
            {
              cuwcd_well_number: currentSelectedPoint,
            },
            { headers }
          );

          setunfilteredEditTableResults(editTableResults);
          if (editTableResults?.length > 0) {
            const dateFilteredEditTableResults = editTableResults.filter(
              (item) =>
                (new Date(item.test_datetime) > filterValues.startDate &&
                  new Date(item.test_datetime) <
                    (filterValues.endDate || new Date(3000, 0, 1))) ||
                item.datetime === null
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
          (new Date(item.test_datetime) > filterValues.startDate &&
            new Date(item.test_datetime) <
              (filterValues.endDate || new Date(3000, 0, 1))) ||
          item.datetime === null
      );
      setCurrentSelectedEditTableData(dateFilteredEditTableResults);
    }
  }, [filterValues]); // eslint-disable-line

  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState({});
  useEffect(() => {
    if (currentSelectedTimeseriesData?.length) {
      //mutate data for chartJS to use
      let graphData;
      if (radioValue === "has_wqdata") {
        const parameterFilteredData = currentSelectedTimeseriesData.filter(
          (item) => item.wq_parameter_ndx === selectedWQParameter
        );

        graphData =
          parameterFilteredData.length === 0
            ? []
            : {
                labels: parameterFilteredData.map(
                  (item) => new Date(item.test_datetime)
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

  const editTableColumns = [
    {
      title: "CUWCD Well Number",
      field: "well_ndx",
      lookup: cuwcdLookup,
      editable: "never",
      initialEditValue: currentlyPaintedPointRef.current,
    },
    {
      title: "Collected By",
      field: "collected_by_ndx",
      lookup: listCollectedBy,
      initialEditValue: 1,
    },
    {
      title: "Tested By",
      field: "tested_by_ndx",
      lookup: listTestedBy,
      initialEditValue: 1,
    },
    {
      title: "Test Date",
      field: "test_datetime",
      initialEditValue: new Date(),
      type: "datetime",
      render: (rowData) => {
        return dateFormatter(rowData.test_datetime, "MM/DD/YYYY, h:mm A");
      },
      cellStyle: {
        width: 175,
        minWidth: 175,
      },
      validate: (rowData) =>
        !rowData.test_datetime
          ? {
              isValid: false,
              helperText: "Please select a date/time",
            }
          : true,
    },
    {
      title: "Ecoli Presence",
      field: "ecoli_presence",
      lookup: listWqPresenceAbsence,
      initialEditValue: 0,
    },
    {
      title: "Coliform Presence",
      field: "coliform_presence",
      lookup: listWqPresenceAbsence,
      initialEditValue: 0,
    },
    {
      title: "pH",
      field: "ph",
      type: "numeric",
      render: (rowData) => {
        return rowData.ph ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={2}
          isAllowed={(inputObj) => {
            const { value } = inputObj;
            if (value === "") return true;
            if (value <= 14 && value >= 1) return true;
            return false;
          }}
        />
      ),
      // validate: (rowData) =>
      //   isNaN(rowData.ph)
      //     ? {
      //         isValid: false,
      //         helperText: "Must be a positive number or 0",
      //       }
      //     : rowData.ph < 0
      //     ? {
      //         isValid: false,
      //         helperText: "Must be a positive number or 0",
      //       }
      //     : true,
    },
    {
      title: "Conductivity",
      field: "conductivity",
      type: "numeric",
      render: (rowData) => {
        return rowData.conductivity ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={0}
          allowNegative={false}
        />
      ),
    },
    {
      title: "TDS",
      field: "tds",
      type: "numeric",
      render: (rowData) => {
        return rowData.tds ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={0}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Salinity",
      field: "salinity",
      type: "numeric",
      render: (rowData) => {
        return rowData.salinity ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={2}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Alkalinity",
      field: "alkalinity",
      type: "numeric",
      render: (rowData) => {
        return rowData.alkalinity ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={0}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Hardness",
      field: "hardness",
      type: "numeric",
      render: (rowData) => {
        return rowData.hardness ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={0}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Nitrite",
      field: "nitrite",
      type: "numeric",
      render: (rowData) => {
        return rowData.nitrite ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={3}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Nitrate",
      field: "nitrate",
      type: "numeric",
      render: (rowData) => {
        return rowData.nitrate ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={3}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Phosphate",
      field: "phosphate",
      type: "numeric",
      render: (rowData) => {
        return rowData.phosphate ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={2}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Sulfate",
      field: "sulfate",
      type: "numeric",
      render: (rowData) => {
        return rowData.sulfate ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={0}
          allowNegative={false}
        />
      ),
    },
    {
      title: "Fluoride",
      field: "fluoride",
      type: "numeric",
      render: (rowData) => {
        return rowData.fluoride ?? "--";
      },
      editComponent: (props) => (
        <NumberFormat
          onChange={(e) => props.onChange(e.target.value)}
          defaultValue={props.value || null}
          decimalScale={2}
          allowNegative={false}
        />
      ),
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
    if (graphType === "Water Quality") {
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
      <Helmet title="Water Quality" />
      <Typography variant="h3" gutterBottom display="inline">
        Well Production Data
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Water Quality</Typography>
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
                <DashboardMap
                  map={map}
                  setMap={setMap}
                  data={filteredData}
                  isLoading={isLoading}
                  error={error}
                  setCurrentSelectedPoint={setCurrentSelectedPoint}
                  radioValue={radioValue}
                  currentlyPaintedPointRef={currentlyPaintedPointRef}
                  coordinatesContainerRef={coordinatesContainerRef}
                  longRef={longRef}
                  latRef={latRef}
                  eleRef={eleRef}
                  setRadioValue={setRadioValue}
                  defaultFilterValue="has_wqdata"
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
                  Well Quality Data
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
                      endpoint="dm-wqs"
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
                    ? "Filter Data and Click a Point on the Map to View Corresponding Water Quality Data"
                    : `Select a Point on the Map to View Corresponding Water Quality Data`
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
                            {radioValue === "has_wqdata" && wQparameterOptions && (
                              <>
                                <SidebarSection ml={-3}>
                                  Parameters
                                </SidebarSection>
                                <ListItem
                                  style={{ paddingLeft: 0, paddingRight: 0 }}
                                >
                                  <OptionsPicker
                                    selectedOption={selectedWQParameter}
                                    setSelectedOption={setSelectedWQParameter}
                                    options={wQparameterOptions}
                                    label="Water Quality Parameters"
                                  />
                                </ListItem>
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
                            ? { height: "calc(100% - 118px)" }
                            : null
                        }
                      >
                        <TimeseriesLineChart
                          data={filteredMutatedGraphData}
                          error={error}
                          isLoading={isLoading}
                          yLLabel={`${filteredMutatedGraphData?.parameter} (${filteredMutatedGraphData?.units})`}
                          reverseLegend={false}
                          ref={graphSaveRef}
                          filterValues={filterValues}
                          type="scatter"
                          displayLegend={false}
                          stacked={true}
                          xLabelUnit="day"
                          maxTicksX={12}
                          maxTicksYL={6}
                          maxTicksYR={5}
                          align="center"
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
                    columns={searchTableColumns}
                    data={filteredData}
                    height="350px"
                    actions={[
                      (rowData) => ({
                        icon: "bloodtype",
                        tooltip: "Water Quality",
                        disabled: !rowData.has_wqdata,
                        onClick: (event, rowData) => {
                          setRadioValue("has_wqdata");
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

export default WaterQuality;
