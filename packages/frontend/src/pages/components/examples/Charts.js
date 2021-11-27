import React from "react";
import styled from "styled-components/macro";
import { Grid, Paper } from "@material-ui/core";
import LineChart from "../../charts/Chartjs/LineChart";
import BarChart from "../../charts/Chartjs/BarChart";
import DoughnutChart from "../../charts/Chartjs/DoughnutChart";
import PieChart from "../../charts/Chartjs/PieChart";
import RadarChart from "../../charts/Chartjs/RadarChart";

const Root = styled.div`
  .MuiCardContent-root {
    padding: 0;
  }
`;

const Well = styled(Paper)`
  .MuiPaper-root {
    padding: ${(props) => props.theme.spacing(4)}px;
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

export default function Charts() {
  return (
    <Root>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Well>
            <LineChart />
          </Well>
        </Grid>
        <Grid item xs={12} md={6}>
          <Well>
            <BarChart />
          </Well>
        </Grid>
        <Grid item xs={12} md={6}>
          <Well>
            <DoughnutChart />
          </Well>
        </Grid>
        <Grid item xs={12} md={6}>
          <Well>
            <PieChart />
          </Well>
        </Grid>
        <Grid item xs={12} md={6}>
          <Well>
            <RadarChart />
          </Well>
        </Grid>
        <Grid item xs={12} md={6}>
          <Well>
            <RadarChart />
          </Well>
        </Grid>
      </Grid>
    </Root>
  );
}
