import React from "react";
import styled from "styled-components/macro";
import { Card as MuiCard } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const Card = styled(MuiCard)`
  height: calc(100% - 24px);

  margin-top: ${(props) => props.theme.spacing(30)}px;
  padding-top: ${(props) => props.theme.spacing(6)}px;
  padding-bottom: ${(props) => props.theme.spacing(4)}px;

  ${(props) => props.theme.breakpoints.down("xs")} {
    margin-top: ${(props) => props.theme.spacing(6)}px;
  }
  ${(props) => props.theme.breakpoints.only("sm")} {
    margin-top: ${(props) => props.theme.spacing(20)}px;
  }

  .MuiCardContent-root {
    text-align: center;
  }
`;

export function ErrorCard({ title, subtitle, actions }) {
  return (
    <Grid container justify={"center"} alignItems={"center"}>
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Card>
          <CardContent>
            {title && <Typography variant="h5">{title}</Typography>}
            {subtitle && <Typography>{subtitle}</Typography>}
            {actions && <Box mt={6}>{actions}</Box>}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
