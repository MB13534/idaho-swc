import copy from "copy-to-clipboard";
import Papa from "papaparse";
import moment from "moment";
import React from "react";
import styled from "styled-components/macro";
import { Chip as MuiChip } from "@material-ui/core";
import { spacing } from "@material-ui/system";

export const scrollWindowToTop = (smooth = true) => {
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
};

/**
 * Utility function used to implement
 * copy to clipboard functionality
 * @param {array} data
 * @param {array} columns
 * @param {function} callback
 */
export const copyToClipboard = (data, columns, callback) => {
  const columnOrder = columns.map((d) => d.field);
  copy(
    Papa.unparse(data, {
      delimiter: "\t",
      columns: columnOrder,
    }),
    {
      format: "text/plain",
    }
  );
  callback();
};

export const downloadChartImage = (title, extension, ref) => {
  // console.log(ref.current);
  const base64 = ref.current.toBase64Image();
  const downloadLink = document.createElement("a");
  downloadLink.href = base64;
  downloadLink.download = `${title} ${dateFormatter(
    new Date(),
    "MM/DD/YYYY, h:mm A"
  )}.${extension}`;
  downloadLink.click();
};

export const lineColors = {
  red: "#e6194b",
  green: "#3cb44b",
  orange: "#f58231",
  blue: "#4363d8",
  purple: "#911eb4",
  cyan: "#2CF5F7",
  pink: "#f032e6",
  yellow: "#ffe119",
  neon: "#bcf60c",
  peach: "#fabebe",
  aqua: "#008080",
  lavender: "#e6beff",
  brown: "#9a6324",
  cream: "#fffac8",
  maroon: "#800000",
  turquoise: "#aaffc3",
  olive: "#808000",
  tan: "#ffd8b1",
  royalBlue: "#000075",
  gray: "#8D9093",
  lightGray: "#eee",
  darkGray: "#222",
  white: "#fff",
  black: "#000000",
};

export const dateFormatter = (date, format) => {
  return moment(date).format(format);
};

export const renderStatusChip = (status) => {
  const Chip = styled(MuiChip)`
    ${spacing}
    height: 20px;
    // padding: 4px 0;
    // font-size: 90%;
    margin-top: 1px;
    margin-bottom: 1px;
    padding: 4px 0;
    font-size: 90%;
    background-color: ${(props) => props.rgbcolor};
    color: ${(props) => props.theme.palette.common.white};
  `;

  const colors = {
    GOOD: lineColors.blue,
    STALE: lineColors.gray,
    HIGHVAL: lineColors.orange,
    BATTERY: lineColors.olive,
    LOWVAL: lineColors.olive,
  };
  return typeof status === "string" ? (
    status.split(",").map((word) => {
      return <Chip label={word} rgbcolor={colors[word]} key={word} mr={1} />;
    })
  ) : (
    <Chip label="Unavailable" rgbcolor={lineColors.orange} />
  );
};

export const filterDataByUser = (data, user) => {
  return data
    ? data.filter((item) => !item.exclude_auth0_user_id.includes(user?.sub))
    : [];
};

export const applyInflectorOverrides = (str) => {
  const myStr = str ? str : "";
  return myStr.replace("Curf", "Curve");
};
