import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import useService from "../../../hooks/useService";
import { useApp } from "../../../AppProvider";
import { findRawRecords } from "../../../services/crudService";

import MaterialTable from "material-table";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CopyIcon from "@material-ui/icons/FileCopy";
import {
  Accordion,
  AccordionDetails,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  FormControl as MuiFormControl,
  FormControlLabel,
  FormLabel,
  Grid as MuiGrid,
  Radio,
  RadioGroup,
  TextField,
  Link,
  Button,
  AccordionSummary,
  Typography as MuiTypography,
} from "@material-ui/core";

import Panel from "../../../components/panels/Panel";
import Loader from "../../../components/Loader";
import { copyToClipboard, dateFormatter } from "../../../utils";

const Divider = styled(MuiDivider)(spacing);
const Grid = styled(MuiGrid)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Typography = styled(MuiTypography)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  height: 100%;
  width: 100%;
`;

const FormControl = styled(MuiFormControl)`
  width: 100%;
`;

function Rolodex() {
  const service = useService({ toast: false });
  const { doToast } = useApp();
  const { getAccessTokenSilently } = useAuth0();

  const [selectedRow, setSelectedRow] = useState(null);

  const defaultRowValues = {
    rolo_ndx: null,
    lastname: null,
    firstname: null,
    organization: null,
    address: null,
    city: null,
    state: "TX",
    zipcode: null,
    email_1: null,
    email_2: null,
    phone_1: null,
    phone_2: null,
    permit_holder: false,
    well_contact: false,
    removed: false,
  };

  const handleUpdateSelectedRow = (name, value) => {
    const prevState = { ...selectedRow };

    if (["removed", "permit_holder", "well_contact"]) {
      prevState[name] = str2bool(value);
    } else {
      prevState[name] = "" + value;
    }

    setSelectedRow(prevState);
  };

  const { data } = useQuery(
    ["ListRolodexes"],
    async () => {
      try {
        const response = await service([findRawRecords, ["ListRolodexes"]]);
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

  const [filteredData, setFilteredData] = useState(null);
  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const editTableColumns = [
    {
      title: "Last Name",
      field: "lastname",
    },
    {
      title: "First Name",
      field: "firstname",
    },
    {
      title: "Organization",
      field: "organization",
    },
    {
      title: "Address",
      field: "address",
    },
    {
      title: "City",
      field: "city",
    },
    {
      title: "Phone",
      field: "phone_1",
    },
    {
      title: "Email",
      field: "email_1",
    },
  ];

  const isSubmitButtonDisabled =
    selectedRow === null
      ? true
      : !(
          selectedRow.lastname ||
          selectedRow.firstname ||
          selectedRow.organization
        );

  //helper function that turns a string boolean/null into a real boolean or null
  const str2bool = (value) => {
    if (value && typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
      if (value.toLowerCase() === "unknown") return null;
    }
    return value;
  };

  const handleSubmit = () => {
    if (selectedRow.rolo_ndx) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = () => {
    return (async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const { data: addedEntry } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/list-rolodexes`,
          selectedRow,
          { headers }
        );
        //update the material table
        setFilteredData((prevState) => {
          let data = [...prevState];
          data.unshift(addedEntry);
          return data;
        });
        doToast("success", "New entry was saved to the database");
        //clear the currentRow and removes the form
        setSelectedRow(null);
      } catch (err) {
        console.error(err);
        const message = err?.message ?? "Something went wrong";
        doToast("error", message);
      }
    })();
  };

  const handleUpdate = () => {
    return (async () => {
      try {
        if (selectedRow) {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.put(
            `${process.env.REACT_APP_ENDPOINT}/api/list-rolodexes/${selectedRow.rolo_ndx}`,
            selectedRow,
            { headers }
          );
          //update the material table
          setFilteredData((prevState) => {
            const data = [...prevState];
            data[
              data.findIndex((item) => item.rolo_ndx === selectedRow.rolo_ndx)
            ] = selectedRow;
            return data;
          });
          doToast("success", "New data was updated to the database");
          //clear the currentRow and removes the form
          setSelectedRow(null);
        } else {
          doToast("error", "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        const message = err?.message ?? "Something went wrong";
        doToast("error", message);
      }
    })();
  };

  const handleDelete = (oldData) => {
    return (async () => {
      try {
        if (oldData) {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.delete(
            `${process.env.REACT_APP_ENDPOINT}/api/list-rolodexes/${oldData.rolo_ndx}`,
            { headers }
          );
          //update the material table
          setFilteredData((prevState) => {
            const data = [...prevState];
            const index = oldData.tableData.id;
            data.splice(index, 1);
            return data;
          });
          doToast("success", "This entry was deleted from the database");
        } else {
          doToast("error", "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        const message = err?.message ?? "Something went wrong";
        doToast("error", message);
      }
    })();
  };

  return (
    <React.Fragment>
      <Helmet title="Rolodex" />
      <Typography variant="h3" gutterBottom display="inline">
        Rolodex
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Rolodex</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="table-content"
              id="table-header"
            >
              <Typography variant="h4" ml={2}>
                Rolodex
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TableWrapper>
                  {filteredData ? (
                    <MaterialTable
                      id="Rolodex"
                      title={`Rolodex ${dateFormatter(
                        new Date(),
                        "MM/DD/YYYY, h:mm A"
                      )}`}
                      columns={editTableColumns}
                      data={filteredData}
                      editable={{
                        onRowDelete: handleDelete,
                      }}
                      localization={{
                        toolbar: { searchPlaceholder: "Search Contacts" },
                      }}
                      components={{
                        Container: (props) => <div {...props} />,
                      }}
                      actions={[
                        {
                          icon: CopyIcon,
                          tooltip: "Copy Data",
                          isFreeAction: true,
                          onClick: () => {
                            try {
                              copyToClipboard(
                                filteredData,
                                editTableColumns,
                                () =>
                                  doToast(
                                    "success",
                                    "Data was copied to your clipboard."
                                  )
                              );
                            } catch (error) {
                              const message =
                                error?.message ?? "Something went wrong";
                              doToast("error", message);
                            }
                          },
                        },
                        () => ({
                          icon: "edit",
                          tooltip: "Edit",
                          onClick: (event, rowData) => {
                            setSelectedRow(rowData);
                          },
                        }),
                        {
                          icon: "add_box",
                          tooltip: "Add",
                          isFreeAction: true,
                          onClick: () => {
                            setSelectedRow(defaultRowValues);
                          },
                        },
                      ]}
                      options={{
                        emptyRowsWhenPaging: false,
                        columnsButton: true,
                        exportButton: true,
                        exportAllData: true,
                        addRowPosition: "first",
                        pageSize: 30,
                        pageSizeOptions: [5, 10, 30, 60],
                        padding: "dense",
                        searchFieldAlignment: "left",
                        showTitle: false,
                        maxBodyHeight: "400px",
                      }}
                    />
                  ) : (
                    <Loader />
                  )}
                </TableWrapper>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>

      {selectedRow && (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="table-content"
                id="table-header"
              >
                <Typography variant="h4" ml={2}>
                  {!selectedRow.rolo_ndx
                    ? "Creating New Clearwater Rolodex Contact"
                    : `Editing Clearwater Rolodex Record No. ${selectedRow.rolo_ndx}`}
                </Typography>
              </AccordionSummary>
              <Panel>
                <AccordionDetails>
                  <Grid container spacing={10}>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        required
                        error={
                          !(
                            selectedRow.lastname ||
                            selectedRow.firstname ||
                            selectedRow.organization
                          )
                        }
                        helperText={
                          !(
                            selectedRow.lastname ||
                            selectedRow.firstname ||
                            selectedRow.organization
                          )
                            ? "A contact reference is required."
                            : ""
                        }
                        variant="outlined"
                        label="Last Name"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("lastname", e.target.value)
                        }
                        value={selectedRow.lastname || ""}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        required
                        error={
                          !(
                            selectedRow.lastname ||
                            selectedRow.firstname ||
                            selectedRow.organization
                          )
                        }
                        helperText={
                          !(
                            selectedRow.lastname ||
                            selectedRow.firstname ||
                            selectedRow.organization
                          )
                            ? "A contact reference is required."
                            : ""
                        }
                        variant="outlined"
                        label="First Name"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("firstname", e.target.value)
                        }
                        value={selectedRow.firstname || ""}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        required
                        error={
                          !(
                            selectedRow.lastname ||
                            selectedRow.firstname ||
                            selectedRow.organization
                          )
                        }
                        helperText={
                          !(
                            selectedRow.lastname ||
                            selectedRow.firstname ||
                            selectedRow.organization
                          )
                            ? "A contact reference is required."
                            : ""
                        }
                        variant="outlined"
                        label="Organization"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow(
                            "organization",
                            e.target.value
                          )
                        }
                        value={selectedRow.organization || ""}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={5}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        label="Address"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("address", e.target.value)
                        }
                        value={selectedRow.address || ""}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={3}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        label="City"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("city", e.target.value)
                        }
                        value={selectedRow.city || ""}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={2}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        label="State"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("state", e.target.value)
                        }
                        value={selectedRow.state || ""}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={2}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        label="Zip Code"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("zipcode", e.target.value)
                        }
                        value={selectedRow.zipcode || ""}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        type="email"
                        variant="outlined"
                        label="Email"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("email_1", e.target.value)
                        }
                        value={selectedRow.email_1 || ""}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        type="tel"
                        variant="outlined"
                        label="Phone #"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("phone_1", e.target.value)
                        }
                        value={selectedRow.phone_1 || ""}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        type="email"
                        variant="outlined"
                        label="Secondary Email"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("email_2", e.target.value)
                        }
                        value={selectedRow.email_2 || ""}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        type="tel"
                        variant="outlined"
                        label="Secondary Phone #"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("phone_2", e.target.value)
                        }
                        value={selectedRow.phone_2 || ""}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        label="Notes"
                        multiline
                        rows={2}
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("notes", e.target.value)
                        }
                        value={selectedRow.notes || ""}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      style={{
                        position: "relative",
                      }}
                    >
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          Should this contact be hidden from all lists?'
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="removed"
                          name="removed"
                          onChange={(e) => {
                            handleUpdateSelectedRow("removed", e.target.value);
                          }}
                          value={selectedRow.removed ?? false}
                        >
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      style={{
                        position: "relative",
                      }}
                    >
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          Should this contact appear on the 'Permit Holder
                          List?'
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="permit_holder"
                          name="permit_holder"
                          onChange={(e) => {
                            handleUpdateSelectedRow(
                              "permit_holder",
                              e.target.value
                            );
                          }}
                          value={selectedRow.permit_holder ?? false}
                        >
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      style={{
                        position: "relative",
                      }}
                    >
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          Should this contact appear on the 'Well Contacts
                          List?'
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="well_contact"
                          name="well_contact"
                          onChange={(e) => {
                            handleUpdateSelectedRow(
                              "well_contact",
                              e.target.value
                            );
                          }}
                          value={selectedRow.well_contact ?? false}
                        >
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={8}
                      style={{
                        position: "relative",
                      }}
                    />
                    <Grid
                      item
                      xs={12}
                      md={1}
                      style={{
                        position: "relative",
                      }}
                    >
                      <Button
                        style={{ width: "100%", height: "44px" }}
                        size="small"
                        color="secondary"
                        variant="contained"
                        onClick={() => setSelectedRow(null)}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      style={{
                        position: "relative",
                      }}
                    >
                      <Button
                        disabled={isSubmitButtonDisabled}
                        style={{ width: "100%", height: "44px" }}
                        type="submit"
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Panel>
            </Accordion>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default Rolodex;
