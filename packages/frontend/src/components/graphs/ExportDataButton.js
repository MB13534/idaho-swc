import React from "react";

import { withTheme } from "styled-components/macro";
import { Tooltip as MuiTooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import { spacing } from "@material-ui/system";

import styled from "styled-components/macro";
import { add } from "date-fns";
import { dateFormatter } from "../../utils";

const Tooltip = styled(MuiTooltip)(spacing);

const ExportDataButton = ({ theme, title, data, filterValues }) => {
  const downloadCsvString = (data) => {
    // new Date(item.report_year, item.report_month)
    const header = Object.keys(data[0]).join(",");
    const values = data
      .filter(
        (object) =>
          new Date(object.report_year, object.report_month) >=
            filterValues.startDate &&
          new Date(object.report_year, object.report_month) <=
            add(filterValues.endDate, { months: 1 })
      )
      .map((object) => Object.values(object).join(","))
      .join("\n");
    const csvString = header + "\n" + values;

    const a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvString);
    a.target = "_blank";
    a.download = `Time Series Data for ${
      data[0][title]
    } between ${dateFormatter(
      filterValues.startDate,
      "MM-DD-YYYY"
    )} and ${dateFormatter(filterValues.endDate, "MM-DD-YYYY")}.csv`;
    document.body.appendChild(a);
    a.click();
  };

  return (
    <Tooltip title="Export Data to csv" arrow ml={2}>
      <IconButton
        onClick={() => downloadCsvString(data)}
        style={{
          color:
            theme.palette.type === "dark"
              ? "rgba(255, 255, 255, 0.5)"
              : "rgb(117, 117, 117)",
        }}
        aria-label="download graph"
        component="span"
      >
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  );
};

export default withTheme(ExportDataButton);
