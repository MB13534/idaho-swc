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
import { lineColors } from "../../../utils";

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

function Default() {
  const saveRef = useRef(null);
  const { user, getAccessTokenSilently } = useAuth0();

  const service = useService({ toast: false });
  const { currentUser } = useApp();

  const { data, isLoading, error } = useQuery(
    ["UiListWells", currentUser],
    async () => {
      try {
        const response = await service([findRawRecords, ["UiListWells"]]);
        // const data = filterDataByUser(response, currentUser);
        return response.filter((location) => location.location_geometry);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

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
    { title: "CUWCD Well Name", field: "cuwcd_well_number" },
    { title: "State Well Name", field: "state_well_number" },
    { title: "Source Aquifer", field: "source_aquifer" },
    { title: "Primary Well Use", field: "primary_use" },
    { title: "Current Owner", field: "well_owner" },
    { title: "Well Status", field: "well_status" },
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
                  data={data}
                  isLoading={isLoading}
                  error={error}
                  setCurrentSelectedPoint={setCurrentSelectedPoint}
                />
              </MapContainer>
            </AccordionDetails>
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
                    data={data}
                    height="235px"
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
