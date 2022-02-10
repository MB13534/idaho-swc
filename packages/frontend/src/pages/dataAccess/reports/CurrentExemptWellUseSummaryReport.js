import React from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
} from "@material-ui/core";

import styled from "styled-components/macro";

import { findRawRecords } from "../../../services/crudService";
import Table from "../../../components/Table";
import { spacing } from "@material-ui/system";
import Panel from "../../../components/panels/Panel";
import Link from "@material-ui/core/Link";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import Loader from "../../../components/Loader";
import { lineColors, renderStatusChip } from "../../../utils";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
`;

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

//388px
const CurrentExemptWellUseSummaryReport = () => {
  const service = useService({ toast: false });

  const { data, isLoading, error } = useQuery(
    ["UiReportExemptWellUseSummaries"],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["UiReportExemptWellUseSummaries"],
        ]);
        return response;
      } catch (err) {
        console.error(err);
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  if (error) return "An error has occurred: " + error.message;

  const tabColumns = [
    {
      title: "CUWCD Well Number",
      field: "cuwcd_well_number",
    },
    {
      title: "Exempt?",
      field: "exempt",
      // cellStyle: {
      //   width: 180,
      //   minWidth: 180,
      // },
    },
    { title: "Primary Well Use", field: "primary_well_use" },
    {
      title: "Source Aquifer",
      field: "source_aquifer",
    },
    {
      title: "Well Status",
      field: "well_status",
      render: (rowData) => {
        return renderStatusChip(rowData.well_status, statusChipColors);
      },
    },
  ];

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

  return (
    <>
      <Helmet title="Current Exempt Well Use" />
      <Typography variant="h3" gutterBottom display="inline">
        Current Exempt Well Use Summary
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Current Exempt Well Use</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Panel>
        <TableWrapper>
          {data ? (
            <Table
              label="Exempt Well Use Summary"
              isLoading={isLoading}
              columns={tabColumns}
              data={data}
              height="600px"
            />
          ) : (
            <Loader />
          )}
        </TableWrapper>
      </Panel>
    </>
  );
};

export default CurrentExemptWellUseSummaryReport;
