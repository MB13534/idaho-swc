import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import useService from "../../../hooks/useService";
import { useApp } from "../../../AppProvider";
import { findRawRecords } from "../../../services/crudService";

import MaterialTable from "material-table";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
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
  MenuItem,
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

function WaterLevels() {
  const service = useService({ toast: false });
  const { doToast, lookupTableCache } = useApp();
  const { getAccessTokenSilently } = useAuth0();

  const [selectedRow, setSelectedRow] = useState(null);

  const defaultRowValues = {
    collected_by_ndx: null,
    collected_datetime: new Date(),
    cuwcd_well_number: null,
    dtw_notes: null,
    final_dtw_ft: null,
    meas_1: null,
    meas_2: null,
    meas_3: null,
    meas_4: 0,
    measurement_method_ndx: null,
    ndx: null,
    pumping_status_ndx: null,
    qtr_mile_wells_exist: null,
    static_water_level_ft: null,
  };

  const handleUpdateSelectedRow = (name, value) => {
    const prevState = { ...selectedRow };

    if (name === "measurement_method_ndx") {
      prevState.final_dtw_ft = null;
    }

    if (name === "cuwcd_well_number") {
      if (value) {
        prevState.well_ndx = listWellNdx[value];
      } else {
        prevState.well_ndx = null;
      }
    }

    if (name === "measurement_method_ndx") {
      if (["4", "6"].includes(value)) {
        prevState.meas_2 = null;
        prevState.meas_3 = null;
        prevState.meas_4 = null;
      } else {
        prevState.meas_4 = 0;
      }
    }

    if (name === "qtr_mile_wells_exist") {
      prevState[name] = str2bool(value);
    } else if (name === "cuwcd_well_number" && value === null) {
      prevState[name] = null;
    } else if (name === "final_dtw_ft" && value === null) {
      prevState[name] = null;
    } else if (name === "collected_datetime" && value === null) {
      prevState[name] = null;
    } else {
      prevState[name] = "" + value;
    }

    if (["meas_1", "meas_2", "meas_3", "meas_4"].includes(name)) {
      prevState["final_dtw_ft"] = null;
    }

    setSelectedRow(prevState);
  };

  const { data } = useQuery(
    ["DmDepthToWaters"],
    async () => {
      try {
        const response = await service([findRawRecords, ["DmDepthToWaters"]]);
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

  const listCuwcdWell = useMemo(() => {
    let converted;
    if (data?.length) {
      converted = [...new Set(data.map((item) => item.cuwcd_well_number))];
    }
    return converted;
  }, [data]);

  const listWellNdx = useMemo(() => {
    let converted = {};
    if (data?.length) {
      data.forEach((d) => {
        converted[d.cuwcd_well_number] = d.well_ndx;
      });
    }
    return converted;
  }, [data]);

  //TODO figure out how to sort correctly
  const listMeasurementSource = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length) {
      lookupTableCache["list_collected_bys"].forEach((d) => {
        if (d.applies_to.includes("dtw")) {
          converted[d.collected_by_ndx] = d.collected_by_desc;
        }
      });
    }
    return converted;
  }, [lookupTableCache]);

  //TODO figure out how to sort correctly
  const listPumpingStatus = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length) {
      lookupTableCache["list_pumping_statuses"].forEach((d) => {
        converted[d.pumping_status_ndx] = d.pumping_status_desc;
      });
    }
    return converted;
  }, [lookupTableCache]);

  const listMeasurementMethods = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length) {
      lookupTableCache["list_measurement_methods"].forEach((d) => {
        converted[d.measurement_method_ndx] = d.measurement_method_desc;
      });
    }
    return converted;
  }, [lookupTableCache]);

  const editTableColumns = [
    {
      title: "Well",
      field: "cuwcd_well_number",
    },
    {
      title: "Measurement Date/Time",
      field: "collected_datetime",
      render: (rowData) => {
        return dateFormatter(rowData.collected_datetime, "MM/DD/YYYY, h:mm A");
      },
      searchable: false,
    },
    {
      title: "Final Depth (ft)",
      field: "final_dtw_ft",
      searchable: false,
    },
    {
      title: "Measurement",
      field: "measurement_method_ndx",
      lookup: listMeasurementMethods,
      searchable: false,
    },
    {
      title: "Source",
      field: "collected_by_ndx",
      lookup: listMeasurementSource,
      searchable: false,
    },
    {
      title: "Notes",
      field: "dtw_notes",
      searchable: false,
    },
  ];

  const isCalculateButtonDisabled =
    //fallback to disble if there is no selected row
    selectedRow === null
      ? true
      : //if selected row is transducer(6) or other(4)
      ["6", "4", 6, 4].includes(selectedRow.measurement_method_ndx)
      ? //disabled if meas_1 is null or empty string (need to include 0)
        selectedRow.meas_1 === null || selectedRow.meas_1 === ""
      : ["1", "3", "5", "2", 1, 3, 5, 2].includes(
          selectedRow.measurement_method_ndx
        )
      ? //disabled if meas_1 and meas_4 is null or empty string (need to include 0)
        selectedRow.meas_1 === null ||
        selectedRow.meas_4 === null ||
        selectedRow.meas_1 === "" ||
        selectedRow.meas_4 === ""
      : true;

  const isSubmitButtonDisabled =
    selectedRow === null
      ? true
      : !selectedRow.cuwcd_well_number ||
        !selectedRow.collected_datetime ||
        !selectedRow.collected_by_ndx ||
        !selectedRow.pumping_status_ndx ||
        selectedRow.meas_1 === "" ||
        selectedRow.meas_1 === null ||
        (selectedRow.meas_4 === "" &&
          ![6, 4, "6", "4"].includes(selectedRow.measurement_method_ndx)) ||
        (selectedRow.meas_4 === null &&
          ![6, 4, "6", "4"].includes(selectedRow.measurement_method_ndx)) ||
        selectedRow.final_dtw_ft === "" ||
        selectedRow.final_dtw_ft === null;

  const calculateNewFinalDepth = () => {
    let newFinalDepth;
    //create an array of just the 3 measurements that are filled out
    const measArray = [
      +selectedRow.meas_1,
      +selectedRow.meas_2,
      +selectedRow.meas_3,
    ].filter((item) => item);
    const average =
      measArray.reduce((total, cv) => total + cv, 0) / measArray.length;

    //no calculation for transducer(6) or other(4)
    if (["6", "4", 6, 4].includes(selectedRow.measurement_method_ndx)) {
      newFinalDepth = selectedRow.meas_1;
    } else if (
      //average
      ["1", "3", "5", 1, 3, 5].includes(selectedRow.measurement_method_ndx)
    ) {
      newFinalDepth = average - selectedRow.meas_4;
    } else if (["2", 2].includes(selectedRow.measurement_method_ndx)) {
      newFinalDepth = selectedRow.meas_4 - average * 2.31;
    } else newFinalDepth = null;

    if (isNaN(newFinalDepth)) {
      newFinalDepth = null;
    }
    newFinalDepth = +newFinalDepth;

    handleUpdateSelectedRow(
      "final_dtw_ft",
      newFinalDepth !== null ? +newFinalDepth.toFixed(2) : null
    );
  };

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
    if (selectedRow.ndx) {
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
          `${process.env.REACT_APP_ENDPOINT}/api/dm-depth-to-waters`,
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
            `${process.env.REACT_APP_ENDPOINT}/api/dm-depth-to-waters/${selectedRow.ndx}`,
            selectedRow,
            { headers }
          );
          //update the material table
          setFilteredData((prevState) => {
            const data = [...prevState];
            data[data.findIndex((item) => item.ndx === selectedRow.ndx)] =
              selectedRow;
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
            `${process.env.REACT_APP_ENDPOINT}/api/dm-depth-to-waters/${oldData.ndx}`,
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
      <Helmet title="Well Production" />
      <Typography variant="h3" gutterBottom display="inline">
        Well Water Levels Data
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Well Water Levels</Typography>
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
                Well Water Levels Data
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TableWrapper>
                  {filteredData && !Array.isArray(lookupTableCache) ? (
                    <MaterialTable
                      id="Well Water Levels Data"
                      title={`Well Water Levels Data ${dateFormatter(
                        new Date(),
                        "MM/DD/YYYY, h:mm A"
                      )}`}
                      columns={editTableColumns}
                      data={filteredData}
                      editable={{
                        onRowDelete: handleDelete,
                      }}
                      localization={{
                        toolbar: { searchPlaceholder: "Search Wells" },
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
                  {!selectedRow.ndx
                    ? "New Water Level Data Entry Form"
                    : `Water Level Data Entry Form for Well: ${selectedRow.cuwcd_well_number}`}
                </Typography>
              </AccordionSummary>
              <Panel>
                <AccordionDetails>
                  <Grid container spacing={10}>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{
                        position: "relative",
                      }}
                    >
                      <Autocomplete
                        id="well"
                        options={listCuwcdWell}
                        getOptionLabel={(option) => option || ""}
                        onChange={(e, value) => {
                          handleUpdateSelectedRow("cuwcd_well_number", value);
                        }}
                        value={selectedRow.cuwcd_well_number}
                        renderInput={(params) => (
                          <TextField
                            style={{ width: "100%" }}
                            {...params}
                            variant="outlined"
                            label="Well"
                            required
                            error={!selectedRow.cuwcd_well_number}
                            helperText={
                              !selectedRow.cuwcd_well_number
                                ? "Well Name is Required"
                                : ""
                            }
                          />
                        )}
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
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <FormControl>
                          <KeyboardDateTimePicker
                            format="LLLL do, yyyy, h:mm a"
                            inputVariant="outlined"
                            autoOk
                            required
                            error={!selectedRow.collected_datetime}
                            helperText={
                              !selectedRow.collected_datetime
                                ? "Measurement Date/Time is Required"
                                : ""
                            }
                            id="collected-datetime"
                            label="Measurement Date/Time"
                            value={selectedRow.collected_datetime}
                            onChange={(date) => {
                              handleUpdateSelectedRow(
                                "collected_datetime",
                                date
                              );
                            }}
                            InputAdornmentProps={{
                              "aria-label": "change date",
                            }}
                          />
                        </FormControl>
                      </MuiPickersUtilsProvider>
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
                        error={!selectedRow.collected_by_ndx}
                        helperText={
                          !selectedRow.collected_by_ndx
                            ? "Well Name is Required"
                            : ""
                        }
                        variant="outlined"
                        select
                        label="Measurement Source"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow(
                            "collected_by_ndx",
                            e.target.value
                          )
                        }
                        value={selectedRow.collected_by_ndx || ""}
                      >
                        {Object.keys(listMeasurementSource).map((key) => {
                          return (
                            <MenuItem key={key} value={key}>
                              {listMeasurementSource[key]}
                            </MenuItem>
                          );
                        })}
                      </TextField>
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
                        error={!selectedRow.pumping_status_ndx}
                        helperText={
                          !selectedRow.pumping_status_ndx
                            ? "Pumping Status is Required"
                            : ""
                        }
                        variant="outlined"
                        select
                        label="Pumping Status"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow(
                            "pumping_status_ndx",
                            e.target.value
                          )
                        }
                        value={selectedRow.pumping_status_ndx || ""}
                      >
                        {Object.keys(listPumpingStatus).map((key) => {
                          return (
                            <MenuItem key={key} value={key}>
                              {listPumpingStatus[key]}
                            </MenuItem>
                          );
                        })}
                      </TextField>
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
                        required
                        error={!selectedRow.measurement_method_ndx}
                        helperText={
                          !selectedRow.measurement_method_ndx
                            ? "Measurement Method is Required"
                            : ""
                        }
                        variant="outlined"
                        select
                        label="Measurement Method"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow(
                            "measurement_method_ndx",
                            e.target.value
                          )
                        }
                        value={selectedRow.measurement_method_ndx || ""}
                      >
                        {Object.keys(listMeasurementMethods).map((key) => {
                          return (
                            <MenuItem key={key} value={key}>
                              {listMeasurementMethods[key]}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>

                    {selectedRow.measurement_method_ndx && (
                      <>
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
                              !selectedRow.meas_1 && selectedRow.meas_1 !== 0
                            }
                            helperText={
                              !selectedRow.meas_1 && selectedRow.meas_1 !== 0
                                ? "This measurement is Required"
                                : ""
                            }
                            variant="outlined"
                            label={
                              [2, "2"].includes(
                                selectedRow.measurement_method_ndx
                              )
                                ? "PSI 1"
                                : "Depth 1 (ft)"
                            }
                            type="number"
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleUpdateSelectedRow("meas_1", e.target.value)
                            }
                            value={selectedRow.meas_1 || ""}
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
                          {!["4", "6", 4, 6].includes(
                            selectedRow.measurement_method_ndx
                          ) && (
                            <TextField
                              variant="outlined"
                              label={
                                [2, "2"].includes(
                                  selectedRow.measurement_method_ndx
                                )
                                  ? "PSI 2"
                                  : "Depth 2 (ft)"
                              }
                              type="number"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                handleUpdateSelectedRow(
                                  "meas_2",
                                  e.target.value
                                )
                              }
                              value={selectedRow.meas_2 || ""}
                            />
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={3}
                          style={{
                            position: "relative",
                          }}
                        >
                          {!["4", "6", 4, 6].includes(
                            selectedRow.measurement_method_ndx
                          ) && (
                            <TextField
                              variant="outlined"
                              label={
                                [2, "2"].includes(
                                  selectedRow.measurement_method_ndx
                                )
                                  ? "PSI 3"
                                  : "Depth 3 (ft)"
                              }
                              type="number"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                handleUpdateSelectedRow(
                                  "meas_3",
                                  e.target.value
                                )
                              }
                              value={selectedRow.meas_3 || ""}
                            />
                          )}
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
                            label="Static Water Level (ft)"
                            type="number"
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleUpdateSelectedRow(
                                "static_water_level_ft",
                                e.target.value
                              )
                            }
                            value={selectedRow.static_water_level_ft || ""}
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
                          {!["4", "6", 4, 6].includes(
                            selectedRow.measurement_method_ndx
                          ) && (
                            <TextField
                              required
                              error={
                                !selectedRow.meas_4 && selectedRow.meas_4 !== 0
                              }
                              helperText={
                                !selectedRow.meas_4 && selectedRow.meas_4 !== 0
                                  ? "This measurement is Required"
                                  : ""
                              }
                              variant="outlined"
                              label={
                                [2, "2"].includes(
                                  selectedRow.measurement_method_ndx
                                )
                                  ? "Pump Depth (ft)"
                                  : "Measuring Point Cut (ft)"
                              }
                              type="number"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                handleUpdateSelectedRow(
                                  "meas_4",
                                  e.target.value
                                )
                              }
                              value={selectedRow.meas_4 ?? ""}
                            />
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={3}
                          style={{
                            position: "relative",
                          }}
                        />
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
                              !selectedRow.final_dtw_ft &&
                              selectedRow.final_dtw_ft !== 0
                            }
                            helperText={
                              !selectedRow.final_dtw_ft &&
                              selectedRow.final_dtw_ft !== 0
                                ? "Final Depth is Required"
                                : ""
                            }
                            variant="outlined"
                            label="Final Depth (ft)"
                            // disabled
                            type="number"
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleUpdateSelectedRow(
                                "final_dtw_ft",
                                e.target.value
                              )
                            }
                            value={selectedRow.final_dtw_ft || ""}
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
                          <Button
                            disabled={isCalculateButtonDisabled}
                            variant="contained"
                            size="small"
                            color="primary"
                            style={{ width: "100%", height: "100%" }}
                            onClick={() => calculateNewFinalDepth()}
                          >
                            Calculate Final Depth (ft)
                          </Button>
                        </Grid>
                      </>
                    )}

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
                          Are there registered wells active in "same source
                          aquifer" within 1/4 mile radius of this well?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="qtr_mile_wells_exist"
                          name="qtr_mile_wells_exist"
                          onChange={(e) => {
                            handleUpdateSelectedRow(
                              "qtr_mile_wells_exist",
                              e.target.value
                            );
                          }}
                          value={selectedRow.qtr_mile_wells_exist ?? "unknown"}
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
                          <FormControlLabel
                            value="unknown"
                            control={<Radio />}
                            label="Unknown"
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
                      <TextField
                        variant="outlined"
                        label="Notes"
                        multiline
                        rows={2}
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleUpdateSelectedRow("dtw_notes", e.target.value)
                        }
                        value={selectedRow.dtw_notes || ""}
                      />
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

export default WaterLevels;
