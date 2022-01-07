import copy from "copy-to-clipboard";
import Papa from "papaparse";
import moment from "moment";
import React from "react";
import styled from "styled-components/macro";
import { Chip as MuiChip } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import html2canvas from "html2canvas";
import { add } from "date-fns";

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

export const formatBooleanTrueFalse = (value) => {
  if (typeof value !== "boolean") {
    return value;
  }
  if (value === true) {
    return "yes";
  }
  return "no";
};

export const downloadChartImage = (title, extension, ref) => {
  const base64 = ref.current.toBase64Image();
  const downloadLink = document.createElement("a");
  downloadLink.href = base64;
  downloadLink.download = `${title} ${dateFormatter(
    new Date(),
    "MM/DD/YYYY, h:mm A"
  )}.${extension}`;
  downloadLink.click();
};

export const downloadRef = (title, extension, ref) => {
  html2canvas(ref.current).then(function (canvas) {
    let link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = canvas.toDataURL();
      link.download = `${title} ${dateFormatter(
        new Date(),
        "MM/DD/YYYY, h:mm A"
      )}.${extension}`;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(link.href);
    }
  });
};

// const saveAs = (uri, filename) => {
//   let link = document.createElement("a");
//
//   if (typeof link.download === "string") {
//     link.href = uri;
//     link.download = filename;
//
//     //Firefox requires the link to be in the body
//     document.body.appendChild(link);
//
//     //simulate click
//     link.click();
//
//     //remove the link when done
//     document.body.removeChild(link);
//   } else {
//     window.open(uri);
//   }
// };
//
// export const handleDownloadDiv = (newSaveRef) => {
//   html2canvas(newSaveRef.current).then((canvas) => {
//     saveAs(canvas.toDataURL(), "file-name.png");
//   });
// };

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
  lightBlue: "#74E0FF",
  gray: "#8D9093",
  lightGray: "#eee",
  darkGray: "#222",
  white: "#fff",
  black: "#000000",
};

export const dateFormatter = (date, format) => {
  return moment(date).format(format);
};

export const renderStatusChip = (status, colors) => {
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

  return typeof status === "string" ? (
    status.split(",").map((word, i) => {
      let wordColor;
      if (!isNaN(new Date(word.split(" ")[1]).getTime())) {
        wordColor = new Date(word.split(" ")[1]) - new Date() < 2592000000;
      } else {
        wordColor = word.split(" ")[0];
      }
      return <Chip label={word} rgbcolor={colors[wordColor]} key={i} mr={1} />;
    })
  ) : (
    <Chip label="Unavailable" rgbcolor={lineColors.orange} />
  );
};

// export const filterDataByUser = (data, user) => {
//   return data
//     ? data.filter((item) => !item.exclude_auth0_user_id.includes(user?.sub))
//     : [];
// };

export const applyInflectorOverrides = (str) => {
  const myStr = str ? str : "";
  return myStr.replace("Curf", "Curve");
};

export const firstOfYear = new Date(new Date().getFullYear(), 0, 1);

export const lastOfJanuary = new Date(new Date().getFullYear(), 1, 0);

export const lastOfCurrentMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
);

export const lastOfYear = new Date(new Date().getFullYear(), 11, 31);

export const oneYearAgo = add(new Date(), { years: -1 });

export const filterDataForWellOwner = (data, user) => {
  return data
    ? data.filter((item) => item.authorized_users?.includes(user?.sub))
    : [];
};
