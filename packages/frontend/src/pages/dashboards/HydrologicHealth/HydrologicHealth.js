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

  const [tableData, setTableData] = useState([]);
  const { data, isLoading, error } = useQuery(
    ["hydro-health-sites"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/hydro-health-sites/`
        );

        const groupedData = groupByValue(data, "loc_name");

        setTableData(
          groupedData.map((location) => {
            const obj = {};
            obj["location_name"] = location[0].loc_name;
            location.forEach(
              (item) => (obj[item.avg_start_water_year] = item.hydro_health_pct)
            );
            return obj;
          })
        );

        return data.filter((location) => location.location_geometry);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const cellColorBackground = (value) => {
    if (value <= 10) {
      return "#C61717";
    } else if (value <= 25) {
      return "#F9A825";
    } else if (value <= 75) {
      return "#FFEB3B";
    } else if (value <= 90) {
      return "#16F465";
    } else if (value <= 1000) {
      return "#228044";
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
    } else if (value <= 1000) {
      return "white";
    } else return "black";
  };

  const tableDataColumns = [
    { title: "Location", field: "location_name" },
    {
      title: "2022",
      field: "2022",
      render: (rowData) => `${rowData[2022].toFixed(0)}%`,
      cellStyle: (e, rowData) => {
        return {
          backgroundColor: cellColorBackground(rowData[2022]),
          color: cellColor(rowData[2022]),
        };
      },
    },
    {
      title: "2021",
      field: "2021",
      render: (rowData) => `${rowData[2021].toFixed(0)}%`,
      cellStyle: (e, rowData) => {
        return {
          backgroundColor: cellColorBackground(rowData[2021]),
          color: cellColor(rowData[2021]),
        };
      },
    },
    {
      title: "2020",
      field: "2020",
      render: (rowData) => `${rowData[2020].toFixed(0)}%`,
      cellStyle: (e, rowData) => {
        return {
          backgroundColor: cellColorBackground(rowData[2020]),
          color: cellColor(rowData[2020]),
        };
      },
    },
    {
      title: "2019",
      field: "2019",
      render: (rowData) => `${rowData[2019].toFixed(0)}%`,
      cellStyle: (e, rowData) => {
        return {
          backgroundColor: cellColorBackground(rowData[2019]),
          color: cellColor(rowData[2019]),
        };
      },
    },
    {
      title: "2018",
      field: "2018",
      render: (rowData) => `${rowData[2018].toFixed(0)}%`,
      cellStyle: (e, rowData) => {
        return {
          backgroundColor: cellColorBackground(rowData[2018]),
          color: cellColor(rowData[2018]),
        };
      },
    },
  ];

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
                      data={data}
                      isLoading={isLoading}
                      error={error}
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
                Table
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TableWrapper>
                  <Table
                    isLoading={isLoading}
                    pageSize={30}
                    label="Daily Groundwater Elevation Timeseries Table"
                    columns={tableDataColumns}
                    data={tableData}
                    height="100%"
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
