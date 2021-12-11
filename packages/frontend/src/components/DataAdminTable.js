import React, { useState } from "react";

import CopyIcon from "@material-ui/icons/FileCopy";
import { copyToClipboard, dateFormatter } from "../utils";
import MaterialTable from "material-table";
import { useApp } from "../AppProvider";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import styled from "styled-components/macro";

const TableContainer = styled.div`
  // table: {
  // & th: {
  //   paddingLeft: ${(props) => props.theme.spacing(2)}px;
  // },
  // & td: {
  //   paddingLeft: ${(props) => props.theme.spacing(2)}px!important;
  // },
  // }
`;

const DataAdminTable = ({
  columns,
  label,
  data,
  pageSize = 10,
  isLoading = false,
  height,
  actions = [],
  updateHandler,
  endpoint,
  handleRefresh = () => {},
  // ndxField,
  // options = {},
  // components = {},
}) => {
  const { doToast } = useApp();
  const { getAccessTokenSilently } = useAuth0();

  const [selectedRow, setSelectedRow] = useState(null);

  const handleAdd = (newData) => {
    newData["cuwcd_well_number"] = data[0].cuwcd_well_number;
    return (async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const addedRec = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}`,
          newData,
          { headers }
        );
        updateHandler((prevState) => {
          let data = [...prevState];
          data.push(addedRec.data);
          return data;
        });
        handleRefresh();
        doToast("success", "New entry was saved to the database");
      } catch (err) {
        console.error(err);
        const message = err?.message ?? "Something went wrong";
        doToast("error", message);
      }
    })();
  };

  const handleUpdate = (newData, oldData) => {
    return (async () => {
      try {
        if (oldData) {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.put(
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${newData.ndx}`,
            newData,
            { headers }
          );
          updateHandler((prevState) => {
            const data = [...prevState];
            data[data.indexOf(oldData)] = newData;
            return data;
          });
          handleRefresh();
          doToast("success", "New data was updated to the database");
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
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${oldData.ndx}`,
            { headers }
          );
          updateHandler((prevState) => {
            const data = [...prevState];
            const index = oldData.tableData.id;
            data.splice(index, 1);
            return data;
          });
          handleRefresh();
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
    <TableContainer>
      <MaterialTable
        id={label}
        title={`${label} ${dateFormatter(new Date(), "MM/DD/YYYY, h:mm A")}`}
        columns={columns}
        isLoading={isLoading}
        data={data}
        onRowClick={(evt, selectedRow) => {
          setSelectedRow(selectedRow);
        }}
        editable={{
          onRowAdd: handleAdd,
          onRowUpdate: handleUpdate,
          onRowDelete: handleDelete,
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
                copyToClipboard(data, columns, () =>
                  doToast("success", "Data was copied to your clipboard.")
                );
              } catch (error) {
                const message = error?.message ?? "Something went wrong";
                doToast("error", message);
              }
            },
          },
          ...actions,
        ]}
        options={{
          emptyRowsWhenPaging: false,
          columnsButton: true,
          exportButton: true,
          exportAllData: true,
          addRowPosition: "first",
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 30, 60],
          padding: "dense",
          searchFieldAlignment: "left",
          showTitle: false,
          maxBodyHeight: height,
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow && selectedRow.tableData.id === rowData.tableData.id
                ? "#EEE"
                : "#FFF",
          }),
        }}
      />
    </TableContainer>
  );
};

export default DataAdminTable;
