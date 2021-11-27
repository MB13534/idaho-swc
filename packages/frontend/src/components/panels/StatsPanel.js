import React from "react";
import styled from "styled-components/macro";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  darken,
  lighten,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Typography = styled(MuiTypography)(spacing);

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;

const Chip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)}px;

  span {
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }

  &.MuiChip-root {
    color: ${(props) =>
      props.theme.palette.type === "dark"
        ? lighten(props.theme.palette.text.secondary, 0.1)
        : darken(props.theme.palette.text.secondary, 0.05)};
    background-color: ${(props) =>
      props.theme.palette.type === "dark"
        ? darken(props.theme.palette.background.default, 0.05)
        : darken(props.theme.palette.background.default, 0.05)};
  }
`;

function StatsPanel({ children, title, chip }) {
  return (
    <Card mb={3}>
      <CardContent>
        <Typography variant="h6" mb={4}>
          {title}
        </Typography>
        {children}
        {chip && <Chip label={chip} />}
      </CardContent>
    </Card>
  );
}

export default StatsPanel;
