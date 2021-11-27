import React from "react";

import CopyIcon from "@material-ui/icons/FileCopy";
import { copyToClipboard, dateFormatter } from "../utils";
import MaterialTable from "material-table";
import { useApp } from "../AppProvider";

const Table = ({
  columns,
  label,
  data,
  pageSize = 10,
  isLoading = false,
  height,
}) => {
  const { doToast } = useApp();
  return (
    <MaterialTable
      id={label}
      title={`${label} ${dateFormatter(new Date(), "MM/DD/YYYY, h:mm A")}`}
      columns={columns}
      isLoading={isLoading}
      data={data}
      editable={{}}
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
      ]}
      options={{
        emptyRowsWhenPaging: false,
        exportAllData: true,
        columnsButton: true,
        exportButton: true,
        pageSize: pageSize,
        pageSizeOptions: [5, 10, 30, 60],
        padding: "dense",
        searchFieldAlignment: "left",
        showTitle: false,
        maxBodyHeight: height,
      }}
    />
  );
};

export default Table;
