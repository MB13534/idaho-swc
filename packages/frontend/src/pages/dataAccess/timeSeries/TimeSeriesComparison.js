import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { DatePicker, MultiSelect, Select } from "@lrewater/lre-react";
import {
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
  Grid as MuiGrid,
  lighten,
  Typography as MuiTypography,
} from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Panel from "../../../components/panels/Panel";
import SaveGraphButton from "../../../components/graphs/SaveGraphButton";
import { spacing } from "@material-ui/system";

const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  height: calc(100% - 154px);
  width: 100%;
`;

const TimeseriesContainer = styled.div`
  height: 662px;
  // overflow-y: auto;
  width: 100%;
`;

const TimeSeriesComparison = () => {
  const saveRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();

  const { data: Parameters } = useQuery(
    ["timeseries-daily-data-dropdown-parameters"],
    async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data-dropdown-parameters`,
          { headers }
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
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data-dropdown-locations-assoc-param`,
          { headers }
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

  const [filterValues, setFilterValues] = useState({
    parameterLeft: 7,
    locationsLeft: [16],
    parameterRight: 2,
    locationsRight: [48],
    startDate: extractDate(oneWeekAgo),
    endDate: extractDate(new Date()),
  });

  const filterLocations = (locations, parameter) => {
    return locations.filter((location) =>
      location.parameter_ndx_array.includes(parameter)
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

      newValues[name] = value;

      return newValues;
    });
  };

  const { data, error, isFetching, refetch } = useQuery(
    ["timeseries-daily-data"],
    async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const { data: dataLeftAxis } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data/${filterValues.parameterLeft}/${filterValues.locationsLeft}/${filterValues.startDate}/${filterValues.endDate}`,
          { headers }
        );

        const { data: dataRightAxis } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-daily-data/${filterValues.parameterRight}/${filterValues.locationsRight}/${filterValues.startDate}/${filterValues.endDate}`,
          { headers }
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

        // labels: data[0].map((item) => item.rdate),
        // yLLabel: `${data[0][0]?.parameter_name} (${data[0][0]?.units_name})`,
        // datasets: [
        //   data.map((location, i) => {
        //     return {
        //       data: location.map((item) => item.result_value_daily),
        //       units: location[0].units_name,
        //       pointStyle: "point",
        //       fill: false,
        //       borderWidth: 2,
        //       pointRadius: 0,
        //       pointHoverRadius: 4,
        //       label: location[0].loc_name,
        //       borderColor: Object.values(lineColors)[i],
        //       backgroundColor: Object.values(lineColors)[i],
        //       tension: 0.5,
        //     };
        //   }),
        // ][0],
      };
      setGraphData(graphData);
    }
  }, [data]);

  return (
    <>
      {Parameters && Locations && (
        <>
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
                      <Grid container pb={6} mt={2}>
                        <Grid
                          item
                          style={{
                            flexGrow: 1,
                            maxWidth: "calc(100% - 154px)",
                          }}
                        >
                          <Grid container>
                            <Grid item xs={12}>
                              <Select
                                name="parameterLeft"
                                label="Parameters"
                                variant="outlined"
                                valueField="parameter_ndx"
                                displayField="parameter_name"
                                outlineColor="primary"
                                labelColor="primary"
                                margin="normal"
                                data={Parameters}
                                value={filterValues.parameterLeft}
                                onChange={handleFilter}
                                width={200}
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
                                data={filterLocations(
                                  Locations,
                                  filterValues.parameterLeft
                                )}
                                value={filterValues.locationsLeft}
                                onChange={handleFilter}
                                width="calc(100% - 215px - 215px)"
                              />
                              <DatePicker
                                name="startDate"
                                label="Start Date"
                                variant="outlined"
                                outlineColor="primary"
                                labelColor="primary"
                                value={filterValues.startDate}
                                onChange={handleFilter}
                                width={200}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Select
                                name="parameterRight"
                                label="Parameters"
                                variant="outlined"
                                valueField="parameter_ndx"
                                displayField="parameter_name"
                                outlineColor="primary"
                                labelColor="primary"
                                margin="normal"
                                data={Parameters}
                                value={filterValues.parameterRight}
                                onChange={handleFilter}
                                width={200}
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
                                data={filterLocations(
                                  Locations,
                                  filterValues.parameterRight
                                )}
                                value={filterValues.locationsRight}
                                onChange={handleFilter}
                                width="calc(100% - 215px - 215px)"
                              />
                              <DatePicker
                                name="endDate"
                                label="End Date"
                                variant="outlined"
                                outlineColor="primary"
                                labelColor="primary"
                                value={filterValues.endDate}
                                onChange={handleFilter}
                                width={200}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          style={{
                            width: "153px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            onClick={() => refetch()}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            size="large"
                            disabled={
                              !filterValues.locationsLeft.length ||
                              !filterValues.locationsRight.length
                            }
                          >
                            Submit
                          </Button>
                          <SaveGraphButton
                            ref={saveRef}
                            title="Timeseries Comparison Graph"
                          />
                        </Grid>
                      </Grid>

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
                          // yRLLabel={
                          //   graphData &&
                          //   graphData[filterValues["yR"]] &&
                          //   `${graphData[filterValues["yR"]][0]?.parameter} (${
                          //     graphData[filterValues["yR"]][0]?.units
                          //   })`
                          // }
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
        </>
      )}
    </>
  );
};

export default TimeSeriesComparison;
