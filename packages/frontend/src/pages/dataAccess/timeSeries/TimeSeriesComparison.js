import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { DatePicker, MultiSelect, Select } from "@lrewater/lre-react";
import {
  dateFormatter,
  extractDate,
  groupByValue,
  lineColors,
  oneWeekAgo,
} from "../../../utils";
import Button from "@material-ui/core/Button";
import TimeseriesLineChart from "../../../components/graphs/TimeseriesLineChart";
import styled from "styled-components/macro";
import {
  Accordion,
  AccordionDetails,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid as MuiGrid,
  lighten,
  Typography as MuiTypography,
} from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Panel from "../../../components/panels/Panel";
import SaveGraphButton from "../../../components/graphs/SaveGraphButton";
import { spacing } from "@material-ui/system";
import { customSecondary } from "../../../theme/variants";
import { Alert } from "@material-ui/lab";
import TimeseriesComparisonMap from "../../../components/map/TimeseriesComparisonMap";
import Table from "../../../components/Table";
import { Helmet } from "react-helmet-async";
import Link from "@material-ui/core/Link";
import { NavLink } from "react-router-dom";

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

const TimeseriesContainer = styled.div`
  height: 600px;
  // overflow-y: auto;
  width: 100%;
`;

const SubmitGrid = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 4px;
  margin-left: 4px;
  margin-top: 10px;
  width: 100%;
`;

const SidebarSection = styled(MuiTypography)`
  ${spacing}
  color: ${() => customSecondary[500]};
  padding: ${(props) => props.theme.spacing(2)}px
    ${(props) => props.theme.spacing(7)}px
    ${(props) => props.theme.spacing(1)}px;
  opacity: 0.9;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  display: block;
`;

const MapContainer = styled.div`
  height: 406px;
  width: 100%;
`;

const TimeSeriesComparison = () => {
  const saveRef = useRef(null);

  const [filterValues, setFilterValues] = useState({
    huc8s: [],
    parameterLeft: 7,
    locationsLeft: [16],
    parameterRight: 2,
    locationsRight: [48],
    startDate: extractDate(oneWeekAgo),
    endDate: extractDate(new Date()),
  });

  const { data: Huc8s } = useQuery(
    ["timeseries-daily-data-dropdown-huc8"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data-dropdown-huc8`
        );

        setFilterValues((prevState) => {
          let newValues = { ...prevState };
          const selectAllHuc8s = data.map((huc8) => huc8.huc8_ndx);
          newValues["huc8s"] = selectAllHuc8s;
          return newValues;
        });

        return data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: Parameters } = useQuery(
    ["timeseries-daily-data-dropdown-parameters"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data-dropdown-parameters`
        );
        return data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: Locations } = useQuery(
    ["timeseries-daily-data-dropdown-locations-assoc-param"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data-dropdown-locations-assoc-param`
        );
        return data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const filterLocationsByParameter = (locations, parameter) => {
    return locations.filter((location) =>
      location.parameter_ndx_array.includes(parameter)
    );
  };

  const filterLocationsByHuc8s = (locations, huc8s) => {
    return locations.filter(
      (location) =>
        huc8s.filter((huc8) => location.huc8_ndx_array.includes(huc8)).length
    );
  };

  const handleFilter = (event) => {
    const { name, value } = event.target;
    setFilterValues((prevState) => {
      let newValues = { ...prevState };

      if (name === "parameterLeft") {
        newValues["locationsLeft"] = [];
      }
      if (name === "parameterRight") {
        newValues["locationsRight"] = [];
      }

      if (name === "huc8s") {
        newValues["locationsLeft"] = [];
        newValues["locationsRight"] = [];
        newValues["parameterLeft"] = "";
        newValues["parameterRight"] = "";
      }

      newValues[name] = value;

      return newValues;
    });
  };

  const { data, error, isFetching, refetch } = useQuery(
    ["timeseries-daily-data"],
    async () => {
      try {
        const { data: dataLeftAxis } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data/${filterValues.parameterLeft}/${filterValues.locationsLeft}/${filterValues.startDate}/${filterValues.endDate}`
        );

        const { data: dataRightAxis } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data/${filterValues.parameterRight}/${filterValues.locationsRight}/${filterValues.startDate}/${filterValues.endDate}`
        );

        const groupedData = {
          leftAxis: groupByValue(dataLeftAxis, "loc_ndx"),
          rightAxis: groupByValue(dataRightAxis, "loc_ndx"),
        };

        return groupedData;
      } catch (err) {
        console.error(err);
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const tableColumns = [
    { title: "HUC8", field: "huc8" },
    { title: "Parameter Name", field: "parameter_name" },
    { title: "Location Name", field: "loc_name" },
    {
      title: "Result",
      field: "result_value_daily",
      render: (rowData) => {
        return rowData.result_value_daily.toFixed(2);
      },
    },
    { title: "Units", field: "units_name" },
    {
      title: "Last Report",
      field: "rdate",
      render: (rowData) => {
        return dateFormatter(rowData.rdate, "MM/DD/YYYY, h:mm A");
      },
    },
    { title: "Data Provider Name", field: "data_provider_name" },
    { title: "Location Type Name", field: "loc_type_name" },
    { title: "HUC10", field: "huc10" },
  ];

  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    // data?.leftAxis?.length && data?.rightAxis?.length
    if (data) {
      let count = -1;
      const graphData = {
        yLLabel: data?.leftAxis?.length
          ? `${data?.leftAxis[0][0]?.parameter_name} (${data?.leftAxis[0][0]?.units_name})`
          : null,
        yRLabel: data?.rightAxis?.length
          ? `${data?.rightAxis[0][0]?.parameter_name} (${data?.rightAxis[0][0]?.units_name})`
          : null,
        datasets: [
          ...data.rightAxis.map((location) => {
            count++;
            return {
              data: location.map((item) => {
                return {
                  x: item.rdate,
                  y: item.result_value_daily,
                };
              }),
              yAxisID: "yR",
              units: location[0].units_name,
              pointStyle: "circle",
              borderWidth: 2,
              borderCapStyle: "round",
              borderDash: [8, 10],
              pointRadius: 0,
              pointHoverRadius: 4,
              label: location[0].loc_name,
              borderColor: Object.values(lineColors)[count],
              backgroundColor: lighten(Object.values(lineColors)[count], 0.5),
              tension: 0.5,
            };
          }),
          ...data.leftAxis.map((location) => {
            count++;
            return {
              data: location.map((item) => {
                return {
                  x: item.rdate,
                  y: item.result_value_daily,
                };
              }),
              yAxisID: "yL",
              units: location[0].units_name,
              pointStyle: "circle",
              fill: false,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              label: location[0].loc_name,
              borderColor: Object.values(lineColors)[count],
              backgroundColor: lighten(Object.values(lineColors)[count], 0.5),
              tension: 0.5,
            };
          }),
        ],
      };
      setGraphData(graphData);
    }
  }, [data]);

  return (
    <>
      <Helmet title="Time Series Comparisons" />
      <Typography variant="h3" gutterBottom display="inline">
        Time Series Comparisons
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Time Series Comparisons</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        {Locations && Huc8s && (
          <Grid item xs={12} md={12} lg={12} xl={5}>
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
                  <TimeseriesComparisonMap
                    selectedHuc8Locations={filterLocationsByHuc8s(
                      Locations,
                      filterValues.huc8s
                    ).map((location) => location.loc_ndx)}
                    selectedLeftLocations={filterValues.locationsLeft}
                    selectedRightLocations={filterValues.locationsRight}
                  />
                </MapContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {Parameters && Locations && Huc8s && (
          <>
            <Grid item xs={12} md={12} lg={12} xl={7}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="time-series"
                  id="time-series"
                >
                  <Typography variant="h4" ml={2}>
                    Filter Controls
                  </Typography>
                </AccordionSummary>
                <Panel>
                  <AccordionDetails>
                    <Grid container pb={6} mt={2}>
                      <Grid item xs={12}>
                        <SidebarSection>Filters</SidebarSection>
                        <MultiSelect
                          name="huc8s"
                          label="Huc8s"
                          variant="outlined"
                          valueField="huc8_ndx"
                          displayField="huc8"
                          outlineColor="primary"
                          labelColor="primary"
                          margin="normal"
                          data={Huc8s}
                          value={filterValues.huc8s}
                          onChange={handleFilter}
                          width="calc(100% - 162px - 162px)"
                        />
                        <DatePicker
                          name="startDate"
                          label="Start Date"
                          variant="outlined"
                          outlineColor="primary"
                          labelColor="primary"
                          value={filterValues.startDate}
                          onChange={handleFilter}
                          width={150}
                        />
                        <DatePicker
                          name="endDate"
                          label="End Date"
                          variant="outlined"
                          outlineColor="primary"
                          labelColor="primary"
                          value={filterValues.endDate}
                          onChange={handleFilter}
                          width={150}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <SidebarSection>Left Axis</SidebarSection>
                        <Select
                          name="parameterLeft"
                          label="Parameters"
                          variant="outlined"
                          valueField="parameter_ndx"
                          displayField="parameter_name"
                          outlineColor="primary"
                          labelColor="primary"
                          margin="normal"
                          data={filterLocationsByHuc8s(
                            Parameters,
                            filterValues.huc8s
                          )}
                          value={filterValues.parameterLeft}
                          onChange={handleFilter}
                          width={220}
                        />
                        <MultiSelect
                          name="locationsLeft"
                          label="Locations"
                          variant="outlined"
                          valueField="loc_ndx"
                          displayField="loc_name"
                          outlineColor="primary"
                          labelColor="primary"
                          margin="normal"
                          data={filterLocationsByParameter(
                            filterLocationsByHuc8s(
                              Locations,
                              filterValues.huc8s
                            ),
                            filterValues.parameterLeft
                          )}
                          value={filterValues.locationsLeft}
                          onChange={handleFilter}
                          width="calc(100% - 236px)"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <SidebarSection>Right Axis</SidebarSection>
                        <Select
                          name="parameterRight"
                          label="Parameters"
                          variant="outlined"
                          valueField="parameter_ndx"
                          displayField="parameter_name"
                          outlineColor="primary"
                          labelColor="primary"
                          margin="normal"
                          data={filterLocationsByHuc8s(
                            Parameters,
                            filterValues.huc8s
                          )}
                          value={filterValues.parameterRight}
                          onChange={handleFilter}
                          width={220}
                        />
                        <MultiSelect
                          name="locationsRight"
                          label="Locations"
                          variant="outlined"
                          valueField="loc_ndx"
                          displayField="loc_name"
                          outlineColor="primary"
                          labelColor="primary"
                          margin="normal"
                          data={filterLocationsByParameter(
                            filterLocationsByHuc8s(
                              Locations,
                              filterValues.huc8s
                            ),
                            filterValues.parameterRight
                          )}
                          value={filterValues.locationsRight}
                          onChange={handleFilter}
                          width="calc(100% - 236px)"
                        />
                      </Grid>
                      <SubmitGrid item container>
                        <Grid item style={{ width: "calc(100% - 162px)" }}>
                          {!data && (
                            <Alert severity="info">
                              After selecting your timeseries inputs, click the
                              red 'Submit' button to load an interactive
                              timeseries plot for comparison across different
                              locations and parameters.
                            </Alert>
                          )}
                          {(data?.leftAxis?.length === 0 ||
                            data?.rightAxis?.length === 0) && (
                            <Alert severity="warning">
                              No data available for{" "}
                              {data?.leftAxis?.length === 0 &&
                              data?.rightAxis?.length === 0
                                ? "left or right"
                                : data?.leftAxis?.length === 0
                                ? "left"
                                : "right"}{" "}
                              axis
                            </Alert>
                          )}
                        </Grid>
                        <Grid item>
                          <SaveGraphButton
                            ref={saveRef}
                            title="Timeseries Comparison Graph"
                          />
                          <Button
                            onClick={() => refetch()}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            size="large"
                            style={{ marginLeft: "10px" }}
                            disabled={
                              !filterValues.locationsLeft.length ||
                              !filterValues.locationsRight.length
                            }
                          >
                            Submit
                          </Button>
                        </Grid>
                      </SubmitGrid>
                    </Grid>
                  </AccordionDetails>
                </Panel>
              </Accordion>
            </Grid>
          </>
        )}
      </Grid>

      {Parameters && Locations && Huc8s && (
        <>
          {data && (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="time-series"
                    id="time-series"
                  >
                    <Typography variant="h4" ml={2}>
                      Graph
                    </Typography>
                  </AccordionSummary>
                  <Panel>
                    <AccordionDetails>
                      <TimeseriesContainer>
                        <TableWrapper>
                          <TimeseriesLineChart
                            data={graphData}
                            error={error}
                            isLoading={isFetching}
                            filterValues={filterValues}
                            locationsOptions={Locations}
                            yLLabel={graphData?.yLLabel}
                            yRLabel={graphData?.yRLabel}
                            xLabelUnit="week"
                            ref={saveRef}
                            tooltipFormat="MM-DD-YYYY"
                            footerLabel="Hours Pumped"
                          />
                        </TableWrapper>
                      </TimeseriesContainer>
                    </AccordionDetails>
                  </Panel>
                </Accordion>
              </Grid>
            </Grid>
          )}

          {data && (
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
                          // isLoading={isLoading}
                          label="Daily Groundwater Elevation Timeseries Table"
                          columns={tableColumns}
                          data={[
                            ...[].concat.apply([], data?.leftAxis),
                            ...[].concat.apply([], data?.rightAxis),
                          ]}
                          height="590px"
                        />
                      </TableWrapper>
                    </AccordionDetails>
                  </Panel>
                </Accordion>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default TimeSeriesComparison;
