import React, { useState } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid as MuiGrid,
  Tab,
  Tabs as MuiTabs,
  Typography,
} from "@material-ui/core";

import styled from "styled-components/macro";

import { findRawRecords } from "../../../services/crudService";
import Table from "../../../components/Table";
import { spacing } from "@material-ui/system";
import Panel from "../../../components/panels/Panel";
import Link from "@material-ui/core/Link";
import { NavLink } from "react-router-dom";
import { Add, Edit } from "@material-ui/icons";
import { lineColors, renderStatusChip } from "../../../utils";
import { Helmet } from "react-helmet-async";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
`;

const Tabs = styled(MuiTabs)(spacing);
const Grid = styled(MuiGrid)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function a11yProps(index) {
  return {
    id: `review-table-${index}`,
    "aria-controls": `review-table-${index}`,
  };
}
//388px
const UiPermitsExpiringsReport = () => {
  const service = useService({ toast: false });

  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, error } = useQuery(
    ["UiPermitsExpirings"],
    async () => {
      try {
        return await service([findRawRecords, ["UiPermitsExpirings"]]);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  if (error) return "An error has occurred: " + error.message;

  const tabInfo = [{ label: "Expiring Permits", data: data }];

  const statusChipColors = {
    EXPIRED: lineColors.red,
    false: lineColors.blue,
    true: lineColors.orange,
  };

  const tabColumns = [
    [
      { title: "Permit Number", field: "permit_number" },
      {
        title: "Expiration Status",
        field: "exp_status",
        render: (rowData) => {
          return renderStatusChip(rowData.exp_status, statusChipColors);
        },
      },
      { title: "Permit Year", field: "permit_year" },
      { title: "Permitted Value", field: "permitted_value" },
      { title: "Agg System Name", field: "agg_system_name" },
      { title: "Permitted Use", field: "permitted_use" },
      { title: "Permit Holder", field: "permit_holder" },
      { title: "Expiration Date", field: "expiration_date" },
      {
        title: "Assoc Wells",
        field: "assoc_wells",
        render: (rowData) => rowData.assoc_wells.join(", "),
        width: "100%",
      },
      { title: "UUID", field: "id" },
    ],
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`pumping-tabpanel-${index}`}
        aria-labelledby={`pumping-tab-${index}`}
        {...other}
      >
        {value === index && children}
      </div>
    );
  };

  return (
    <>
      <Helmet title="Expiring Permits" />
      <Typography variant="h3" gutterBottom display="inline">
        Expiring Permits Report
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Expiring Permits</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Panel>
        <Grid container>
          <Tabs
            mr={6}
            mb={2}
            indicatorColor="primary"
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Review Tables"
          >
            {tabInfo.map((tab, i) => (
              <Tab label={tab.label} {...a11yProps(i)} key={tab.label} />
            ))}
          </Tabs>
        </Grid>
        <TableWrapper>
          {tabColumns.map((tab, i) => (
            <TabPanel value={activeTab} index={i} key={i}>
              <Table
                isLoading={isLoading}
                label={tabInfo[i].label}
                columns={tabColumns[i]}
                data={data}
                height="600px"
                actions={[
                  (rowData) => ({
                    icon: () => {
                      return (
                        <Link
                          component={NavLink}
                          exact
                          to={"/models/dm-permits/" + rowData.id}
                        >
                          <Edit />
                        </Link>
                      );
                    },
                    tooltip: "Edit Permit",
                  }),
                  () => ({
                    icon: () => {
                      return (
                        <Link
                          component={NavLink}
                          exact
                          // to={"/models/dm-permits/" + rowData.id}
                          to={"/models/dm-permits/add"}
                        >
                          <Add />
                        </Link>
                      );
                    },
                    tooltip: "Create New Permit",
                  }),
                ]}
              />
            </TabPanel>
          ))}
        </TableWrapper>
      </Panel>
    </>
  );
};

export default UiPermitsExpiringsReport;
