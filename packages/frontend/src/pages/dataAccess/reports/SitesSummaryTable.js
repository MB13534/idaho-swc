import React from "react";
import { useQuery } from "react-query";

import {
  // Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
} from "@material-ui/core";

import styled from "styled-components/macro";

import Table from "../../../components/Table";
import { spacing } from "@material-ui/system";
import Panel from "../../../components/panels/Panel";
// import Link from "@material-ui/core/Link";
// import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import Loader from "../../../components/Loader";
import { dateFormatter } from "../../../utils";
import axios from "axios";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
`;

const Divider = styled(MuiDivider)(spacing);
// const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

//388px
const SitesSummaryTable = () => {
  const { data, isFetching, error } = useQuery(
    ["public-map/wells"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/public-map/wells/`
        );

        return data.filter((location) => location.location_geometry);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  if (error) return "An error has occurred: " + error.message;

  const tabColumns = [
    {
      title: "Location Name",
      field: "loc_name",
    },
    // {
    //   title: "Location ID",
    //   field: "loc_id",
    // },
    {
      title: "Location Type",
      field: "loc_type_name",
    },
    {
      title: "Parameter",
      field: "parameter_name",
    },
    {
      title: "Data Provider",
      field: "data_provider",
    },
    // {
    //   title: "Region",
    //   field: "loc_region",
    // },
    {
      title: "HUC8",
      field: "huc8_name",
    },
    {
      title: "HUC10",
      field: "huc10_name",
      hidden: true,
      hiddenByColumnsButton: true,
    },
    // {
    //   title: "Irrigation Type",
    //   field: "irgg_type",
    // },
    {
      title: "Starting Period of Record",
      field: "por_start",
      render: (rowData) => {
        return dateFormatter(rowData.por_start, "MM/DD/YYYY");
      },
    },
    {
      title: "Ending Period of Record",
      field: "por_end",
      render: (rowData) => {
        return dateFormatter(rowData.por_end, "MM/DD/YYYY");
      },
    },
    {
      title: "Days",
      field: "num_days",
      hidden: true,
      hiddenByColumnsButton: true,
    },
    {
      title: "Years",
      field: "num_years",
    },
    {
      title: "Samples",
      field: "total_samples",
      hidden: true,
      hiddenByColumnsButton: true,
    },
    {
      title: "Latitude",
      field: "lat_dd",
    },
    {
      title: "Longitude",
      field: "lon_dd",
    },
    {
      title: "External Data Link",
      field: "loc_url",
      render: (rowData) => {
        return (
          <a target="_blank" href={rowData.loc_url} rel="noreferrer">
            <>{rowData.loc_url && "Link"}</>
          </a>
        );
      },
    },
  ];

  return (
    <>
      <Helmet title="Site Summary Table" />
      <Typography variant="h3" gutterBottom display="inline">
        Site Summary Table
      </Typography>

      {/*<Breadcrumbs aria-label="Breadcrumb" mt={2}>*/}
      {/*  <Link component={NavLink} exact to="/dashboard">*/}
      {/*    Dashboard*/}
      {/*  </Link>*/}
      {/*  <Typography>Site Summary Table</Typography>*/}
      {/*</Breadcrumbs>*/}

      <Divider my={6} />
      <Panel>
        <TableWrapper>
          {data ? (
            <Table
              label="Site Summary Table"
              isLoading={isFetching}
              columns={tabColumns}
              data={data}
              height="calc(100vh - 64px - 48px - 106px - 48px - 64px - 156px)"
              pageSize={200}
            />
          ) : (
            <Loader />
          )}
        </TableWrapper>
      </Panel>
    </>
  );
};

export default SitesSummaryTable;
