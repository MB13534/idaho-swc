import React, { useState } from "react";
import styled from "styled-components/macro";
import {
  Accordion,
  AccordionDetails,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid as MuiGrid,
  Slider,
  Typography as MuiTypography,
} from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Panel from "../../../components/panels/Panel";
import { spacing } from "@material-ui/system";
import { customSecondary } from "../../../theme/variants";
import { Helmet } from "react-helmet-async";
import HydrologicHealthMap from "../../../components/map/HydrologicHealthMap";
import Link from "@material-ui/core/Link";
import { NavLink } from "react-router-dom";
import { MinusCircle, PlusCircle } from "react-feather";
import { useQuery } from "react-query";
import axios from "axios";
import Table from "../../../components/Table";
import { groupByValue } from "../../../utils";

const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  height: calc(100%);
  width: 100%;
`;

const SidebarSection = styled(MuiTypography)`
  ${spacing}
  color: ${() => customSecondary[500]};
  padding: ${(props) => props.theme.spacing(2)}px
    ${(props) => props.theme.spacing(7)}px
    ${(props) => props.theme.spacing(10)}px;
  opacity: 0.9;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  display: block;
`;

const MapContainer = styled.div`
  height: 406px;
  width: 100%;
`;

const HydrologicHealth = () => {
  const [selectedYearsOfHistory, setSelectedYearsOfHistory] = useState(1);

  const handleChange = (event, newValue) => {
    setSelectedYearsOfHistory(newValue);
  };

  const {
    data: mapData,
    isLoading: mapDataIsLoading,
    error: mapDataError,
  } = useQuery(
    ["hydro-health-sites-map"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/hydro-health-sites-map/`
        );

        return data.filter((location) => location.location_geometry);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const [dataPointsTableDataColumns, setDataPointsTableDataColumns] = useState(
    []
  );
  const {
    data: dataPointsTableData,
    isLoading: dataPointsTableDataIsLoading,
    error: dataPointsTableDataError,
  } = useQuery(
    ["hydro-health-sites-table"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/hydro-health-sites-table/`
        );

        const groupedData = groupByValue(data, "loc_name");
        const columns = [
          {
            title: "Location",
            field: "location_name",
            cellStyle: {
              whiteSpace: "nowrap",
              padding: "3px 3px 3px 3px",
              position: "sticky",
              left: 0,
              background: "white",
            },
            headerStyle: {
              padding: "3px 3px 3px 3px",
              fontWeight: 900,
              position: "sticky",
              left: 0,
              background: "white",
              zIndex: 11,
            },
            defaultSort: "asc",
            position: "sticky",
            left: 0,
            background: "white",
          },
        ];

        const crossTabbedData = groupedData.map((location) => {
          const obj = {};
          obj["location_name"] = location[0].loc_name;
          location.forEach((item) => {
            if (item?.water_year) {
              obj[item.water_year] = item.hydro_health_pct;
              if (!columns.find((col) => col.title === "" + item.water_year)) {
                columns.push({
                  title: "" + item.water_year,
                  field: "" + item.water_year,
                  render: (rowData) =>
                    rowData[item.water_year] === 0 || rowData[item.water_year]
                      ? `${rowData[item.water_year].toFixed(0)}%`
                      : null,
                  cellStyle: (e, rowData) => {
                    return {
                      padding: "3px 3px 3px 3px",
                      backgroundColor: cellColorBackground(
                        isNaN(rowData[item.water_year])
                          ? null
                          : rowData[item.water_year].toFixed(0)
                      ),
                      color: cellColor(
                        isNaN(rowData[item.water_year])
                          ? null
                          : rowData[item.water_year].toFixed(0)
                      ),
                      textAlign: "center",
                      borderRight: "1px solid rgba(224, 224, 224, 1)",
                    };
                  },
                  headerStyle: {
                    padding: "3px 3px 3px 3px",
                    textAlign: "center",
                    fontWeight: 900,
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                  },
                });
              }
            }
          });
          return obj;
        });
        setDataPointsTableDataColumns(
          columns.sort((a, b) => {
            return b.title - a.title;
          })
        );
        return crossTabbedData;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const [hucTableDataColumns, setHucTableDataColumns] = useState([]);
  const {
    data: hucTableData,
    isLoading: hucTableDataIsLoading,
    error: hucTableDataError,
  } = useQuery(
    ["hydro-health-huc-table"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/hydro-health-huc-table/`
        );

        const groupedData = groupByValue(data, "huc8_name");
        const columns = [
          {
            title: "HUC8",
            field: "huc8_name",
            cellStyle: {
              whiteSpace: "nowrap",
              padding: "3px 3px 3px 3px",
              position: "sticky",
              left: 0,
              background: "white",
            },
            headerStyle: {
              padding: "3px 3px 3px 3px",
              fontWeight: 900,
              position: "sticky",
              left: 0,
              background: "white",
              zIndex: 11,
            },
            defaultSort: "asc",
            position: "sticky",
            left: 0,
            background: "white",
          },
        ];

        const crossTabbedData = groupedData.map((huc) => {
          const obj = {};
          obj["huc8_name"] = huc[0].huc8_name;
          huc.forEach((item) => {
            if (item?.water_year) {
              obj[item.water_year] = item.hydro_health_pct;
              if (!columns.find((col) => col.title === "" + item.water_year)) {
                columns.push({
                  title: "" + item.water_year,
                  field: "" + item.water_year,
                  render: (rowData) =>
                    rowData[item.water_year] === 0 || rowData[item.water_year]
                      ? `${rowData[item.water_year].toFixed(0)}%`
                      : null,
                  cellStyle: (e, rowData) => {
                    return {
                      padding: "3px 3px 3px 3px",
                      backgroundColor: cellColorBackground(
                        isNaN(rowData[item.water_year])
                          ? null
                          : rowData[item.water_year].toFixed(0)
                      ),
                      color: cellColor(
                        isNaN(rowData[item.water_year])
                          ? null
                          : rowData[item.water_year].toFixed(0)
                      ),
                      textAlign: "center",
                      borderRight: "1px solid rgba(224, 224, 224, 1)",
                    };
                  },
                  headerStyle: {
                    padding: "3px 3px 3px 3px",
                    textAlign: "center",
                    fontWeight: 900,
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                  },
                });
              }
            }
          });
          return obj;
        });
        setHucTableDataColumns(
          columns.sort((a, b) => {
            return b.title - a.title;
          })
        );
        return crossTabbedData;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const cellColorBackground = (value) => {
    if (value === null) {
      return "black";
    } else if (value <= 10) {
      return "#C61717";
    } else if (value <= 25) {
      return "#F9A825";
    } else if (value <= 75) {
      return "#FFEB3B";
    } else if (value <= 90) {
      return "#16F465";
    } else if (value <= 100) {
      return "#228044";
    } else if (value <= 1000) {
      return "#1155cc";
    } else return "black";
  };

  const cellColor = (value) => {
    if (value <= 10) {
      return "white";
    } else if (value <= 25) {
      return "black";
    } else if (value <= 75) {
      return "black";
    } else if (value <= 90) {
      return "black";
    } else if (value <= 100) {
      return "white";
    } else if (value <= 1000) {
      return "white";
    } else return "black";
  };

  const marks = [
    {
      value: 1,
      label: "1 Year",
    },
    {
      value: 2,
      label: "2 Years",
    },
    {
      value: 3,
      label: "3 Years",
    },
    {
      value: 4,
      label: "4 Years",
    },
    {
      value: 5,
      label: "5 Years",
    },
  ];

  if (dataPointsTableDataError)
    return "An error has occurred: " + dataPointsTableDataError.message;

  if (hucTableDataError)
    return "An error has occurred: " + hucTableDataError.message;

  return (
    <>
      <Helmet title="Hydrologic Health" />
      <Typography variant="h3" gutterBottom display="inline">
        Hydrologic Health
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Hydrologic Health</Typography>
      </Breadcrumbs>

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
              <Grid container pb={2} mt={2}>
                <Grid item xs={12}>
                  <MapContainer>
                    <HydrologicHealthMap
                      data={mapData}
                      isLoading={mapDataIsLoading}
                      error={mapDataError}
                      selectedYearsOfHistory={selectedYearsOfHistory}
                    />
                  </MapContainer>
                </Grid>
                <Grid item xs={12} pt={2}>
                  <SidebarSection>
                    Number of Years to Include in Average
                  </SidebarSection>
                  <Grid container spacing={10} pl={3} pr={3}>
                    <Grid item>
                      <MinusCircle />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        id="selectedYearsOfHistory"
                        valueLabelDisplay="on"
                        value={selectedYearsOfHistory}
                        step={1}
                        min={1}
                        max={5}
                        marks={marks}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item>
                      <PlusCircle />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="table-content"
              id="table-header"
            >
              <Typography variant="h4" ml={2}>
                HUC8 Table
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TableWrapper>
                  <Table
                    isLoading={hucTableDataIsLoading}
                    pageSize={30}
                    label="HUC8 Hydrologic Health"
                    columns={hucTableDataColumns}
                    data={hucTableData}
                    height="100%"
                    sortArrow={<React.Fragment />}
                  />
                </TableWrapper>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="table-content"
              id="table-header"
            >
              <Typography variant="h4" ml={2}>
                Data Points Table
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TableWrapper>
                  <Table
                    isLoading={dataPointsTableDataIsLoading}
                    pageSize={30}
                    label="Data Points Hydrologic Health"
                    columns={dataPointsTableDataColumns}
                    data={dataPointsTableData}
                    height="100%"
                    sortArrow={<React.Fragment />}
                  />
                </TableWrapper>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
};

export default HydrologicHealth;
