import React from "react";
import styled from "styled-components/macro";

import {
  Card as MuiCard,
  CardHeader,
  IconButton,
  Chip as MuiChip,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { red, green, orange } from "@material-ui/core/colors";

import { spacing } from "@material-ui/system";

import { MoreVertical } from "react-feather";

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) => props.rgbcolor};
  color: ${(props) => props.theme.palette.common.white};
`;

const Paper = styled(MuiPaper)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
`;

// Data
let id = 0;
function createData(name, start, end, state, assignee) {
  id += 1;
  return { id, name, start, end, state, assignee };
}

const rows = [
  createData(
    "Delta Ridge",
    "01/01/2020",
    "31/06/2020",
    <Chip label="OK" rgbcolor={green[500]} />,
    "James Dalton"
  ),
  createData(
    "Eagle Flats",
    "01/01/2020",
    "31/06/2020",
    <Chip label="Warning" rgbcolor={orange[500]} />,
    "Tracy Mack"
  ),
  createData(
    "Firefront Station",
    "01/01/2020",
    "31/06/2020",
    <Chip label="OK" rgbcolor={green[500]} />,
    "Sallie Love"
  ),
  createData(
    "Omega Charlie",
    "01/01/2020",
    "31/06/2020",
    <Chip label="Failing" rgbcolor={red[500]} />,
    "Glenda Jang"
  ),
  createData(
    "Yellowstone Gate",
    "01/01/2020",
    "31/06/2020",
    <Chip label="OK" rgbcolor={green[500]} />,
    "Raymond Ennis"
  ),
  createData(
    "Cherry Basin",
    "01/01/2020",
    "31/06/2020",
    <Chip label="OK" rgbcolor={green[500]} />,
    "Matthew Winters"
  ),
];

const DashboardTable = () => (
  <Card mb={6}>
    <CardHeader
      action={
        <IconButton aria-label="settings">
          <MoreVertical />
        </IconButton>
      }
      title="Latest Readings"
    />
    <Paper>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Assignee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.start}</TableCell>
                <TableCell>{row.end}</TableCell>
                <TableCell>{row.state}</TableCell>
                <TableCell>{row.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </Paper>
  </Card>
);

export default DashboardTable;
