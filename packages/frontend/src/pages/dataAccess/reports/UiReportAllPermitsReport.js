import React, { useEffect, useState } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Chip as MuiChip,
  Divider as MuiDivider,
  Typography,
} from "@material-ui/core";

import styled from "styled-components/macro";

import { findRawRecords } from "../../../services/crudService";
import Table from "../../../components/Table";
import { spacing } from "@material-ui/system";
import Panel from "../../../components/panels/Panel";
import Link from "@material-ui/core/Link";
import { NavLink, useHistory } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import MultiOptionsPicker from "../../../components/pickers/MultiOptionsPicker";
import Loader from "../../../components/Loader";
import { formatBooleanTrueFalse, lineColors } from "../../../utils";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
`;

const Chip = styled(MuiChip)`
  ${spacing}
  height: 20px;
  margin-top: 1px;
  margin-bottom: 1px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) => props.rgbcolor};
  color: ${(props) => props.theme.palette.common.white};
`;

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

//388px
const UiReportAllPermitsReport = () => {
  const service = useService({ toast: false });
  const history = useHistory();

  const { data, isLoading, error } = useQuery(
    ["UiReportAllPermits"],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["UiReportAllPermits"],
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

  //years to show up in picker
  const [yearsOptions, setYearsOptions] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  useEffect(() => {
    if (data?.length > 0) {
      //creates a unique set of locations to be used in picker
      const distinctYears = [...new Set(data.map((item) => item.permit_year))];

      setYearsOptions(distinctYears);
      //selects every location by default
      setSelectedYears([distinctYears[0]] ?? []);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((item) => selectedYears.includes(item.permit_year))
      );
    }
  }, [selectedYears, data]);

  if (error) return "An error has occurred: " + error.message;

  const tabColumns = [
    {
      title: "Agg System Name",
      field: "agg_system_name",
      cellStyle: {
        width: 145,
        minWidth: 145,
      },
    },
    {
      title: "Permit Holder",
      field: "permit_holder",
      cellStyle: {
        width: 180,
        minWidth: 180,
      },
    },
    { title: "Permit Number", field: "permit_number" },
    {
      title: "Permit Year",
      field: "permit_year",
    },
    { title: "Permitted Value", field: "permitted_value" },
    { title: "Permitted Use", field: "permitted_use" },
    { title: "Expiration Date", field: "expiration_date" },
    {
      title: "Assoc Wells",
      field: "assoc_wells",
      render: (rowData) => {
        return rowData.assoc_wells.map((item) => (
          <Chip label={item} rgbcolor={lineColors.blue} key={item} mr={1} />
        ));
      },
    },
    {
      cellStyle: {
        width: 300,
        minWidth: 300,
      },
      title: "Permit Terms",
      field: "permit_terms",
    },
    {
      title: "Exportable?",
      field: "exportable",
      render: (rowData) => formatBooleanTrueFalse(rowData.exportable),
    },
    {
      title: "Exportable Amount",
      field: "exportable_amount",
    },
    {
      title: "Notes",
      field: "permit_data_notes",
      cellStyle: {
        width: 300,
        minWidth: 300,
      },
    },
  ];

  return (
    <>
      <Helmet title="All Permits" />
      <Typography variant="h3" gutterBottom display="inline">
        All Permits Report
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>All Permits</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Panel>
        <MultiOptionsPicker
          options={yearsOptions}
          selectedOptions={selectedYears}
          setSelectedOptions={setSelectedYears}
          label="Years Filter"
        />

        <TableWrapper>
          {filteredData ? (
            <Table
              label="All Permits Report"
              isLoading={isLoading}
              columns={tabColumns}
              data={filteredData}
              height="600px"
              actions={[
                (rowData) => ({
                  icon: "edit",
                  tooltip: "Edit Permit",
                  disabled: !rowData.id,
                  onClick: (event, rowData) => {
                    history.push("/models/dm-permits/" + rowData.id);
                  },
                }),
              ]}
            />
          ) : (
            <Loader />
          )}
        </TableWrapper>
      </Panel>
    </>
  );
};

export default UiReportAllPermitsReport;
